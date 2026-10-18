package com.agrilenseco.app;

import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.tensorflow.lite.Interpreter;
import org.tensorflow.lite.support.common.ops.NormalizeOp;
import org.tensorflow.lite.support.image.ImageProcessor;
import org.tensorflow.lite.support.image.TensorImage;
import org.tensorflow.lite.support.image.ops.ResizeOp;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "CapacitorTFLitePlugin")
public class CapacitorTFLitePlugin extends Plugin {

    // --- Configuration ---
    // The input size is the width and height the model expects for images.
    private static final int MODEL_INPUT_SIZE = 224;
    // The normalization values are used to scale pixel data from 0-255 to 0.0-1.0 float32
    private static final float NORMALIZE_MEAN = 0.0f;
    private static final float NORMALIZE_STD = 255.0f;
    // The file in assets folder that contains the 30 crop names.
    private static final String LABELS_PATH = "labels.txt";

    // --- Member Variables ---
    private Interpreter tflite;
    private List<String> labels;

    /**
     * Loads the TFLite model and labels from the assets folder.
     * Corresponds to `initLocalModel` in the web app.
     */
    @PluginMethod
    public void loadModel(PluginCall call) {
        String modelPath = call.getString("modelPath");
        if (modelPath == null) {
            modelPath = "models/plant.tflite";
        }

        try {
            MappedByteBuffer modelBuffer = loadModelFile(getContext().getAssets(), modelPath);
            tflite = new Interpreter(modelBuffer);
            labels = loadLabels(getContext().getAssets(), LABELS_PATH);

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (IOException e) {
            call.reject("Failed to load model or labels from assets.", e);
        }
    }

    /**
     * Runs inference on a base64 encoded image.
     * Supports both runInference and classifyImage calls.
     */
    @PluginMethod
    public void runInference(PluginCall call) {
        executeInferenceInternal(call);
    }

    @PluginMethod
    public void classifyImage(PluginCall call) {
        executeInferenceInternal(call);
    }

    private void executeInferenceInternal(PluginCall call) {
        if (tflite == null || labels == null) {
            try {
                MappedByteBuffer modelBuffer = loadModelFile(getContext().getAssets(), "models/plant.tflite");
                tflite = new Interpreter(modelBuffer);
                labels = loadLabels(getContext().getAssets(), LABELS_PATH);
            } catch (Exception e) {
                call.reject("Model is not loaded. Please call 'loadModel' first.", e);
                return;
            }
        }

        String imageDataBase64 = call.getString("imageDataBase64");
        if (imageDataBase64 == null) {
            imageDataBase64 = call.getString("base64Image");
        }
        if (imageDataBase64 == null) {
            call.reject("Image data must be provided as a base64 string.");
            return;
        }

        long startTime = System.currentTimeMillis();

        try {
            // 1. Decode and Preprocess the Image (Resize 224x224 BILINEAR + Normalize 0-1)
            Bitmap bitmap = base64ToBitmap(imageDataBase64);
            TensorImage tensorImage = preprocessImage(bitmap);

            // 2. Run Inference
            float[][] outputProbabilities = new float[1][labels.size()];
            tflite.run(tensorImage.getBuffer(), outputProbabilities);

            // 3. Post-process the results to find the best match
            int topResultIndex = findTopResultIndex(outputProbabilities[0]);
            String plantName = labels.get(topResultIndex);
            float confidence = outputProbabilities[0][topResultIndex];
            long elapsed = System.currentTimeMillis() - startTime;

            // 4. Return the result to the web app
            JSObject result = new JSObject();
            result.put("plantName", plantName);
            result.put("label", plantName);
            result.put("confidence", confidence);
            result.put("inferenceTimeMs", elapsed);
            call.resolve(result);

        } catch (Exception e) {
            call.reject("An error occurred during inference.", e);
        }
    }

    // --- Helper Methods ---

    private MappedByteBuffer loadModelFile(AssetManager assetManager, String modelPath) throws IOException {
        AssetFileDescriptor fileDescriptor = assetManager.openFd(modelPath);
        FileInputStream inputStream = new FileInputStream(fileDescriptor.getFileDescriptor());
        FileChannel fileChannel = inputStream.getChannel();
        long startOffset = fileDescriptor.getStartOffset();
        long declaredLength = fileDescriptor.getDeclaredLength();
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength);
    }

    private List<String> loadLabels(AssetManager assetManager, String labelsPath) throws IOException {
        List<String> labelList = new ArrayList<>();
        BufferedReader reader = new BufferedReader(new InputStreamReader(assetManager.open(labelsPath)));
        String line;
        while ((line = reader.readLine()) != null) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty()) {
                labelList.add(trimmed);
            }
        }
        reader.close();
        return labelList;
    }

    private Bitmap base64ToBitmap(String base64Str) {
        String clean = base64Str;
        if (clean.contains(",")) {
            clean = clean.substring(clean.indexOf(",") + 1);
        }
        byte[] decodedBytes = Base64.decode(clean, Base64.DEFAULT);
        return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
    }

    private TensorImage preprocessImage(Bitmap bitmap) {
        TensorImage tensorImage = TensorImage.fromBitmap(bitmap);

        ImageProcessor imageProcessor = new ImageProcessor.Builder()
                .add(new ResizeOp(MODEL_INPUT_SIZE, MODEL_INPUT_SIZE, ResizeOp.ResizeMethod.BILINEAR))
                .add(new NormalizeOp(NORMALIZE_MEAN, NORMALIZE_STD))
                .build();

        return imageProcessor.process(tensorImage);
    }

    private int findTopResultIndex(float[] probabilities) {
        int maxIndex = 0;
        float maxProbability = -1.0f;
        for (int i = 0; i < probabilities.length; i++) {
            if (probabilities[i] > maxProbability) {
                maxProbability = probabilities[i];
                maxIndex = i;
            }
        }
        return maxIndex;
    }
}
