package hac.javareact;

import java.io.*;
import java.util.*;

import javax.servlet.http.*;
import javax.servlet.annotation.*;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet(name = "ServletApi", value = "/api/highscores")
public class ApiServlet extends HttpServlet {
    private static final String SCORES_FILE_NAME = "scores.dat";
    @Override
    public void init() {
        // Initialize the high scores data structure by loading it from a file
        try(FileInputStream fileIn = new FileInputStream(SCORES_FILE_NAME)) {

        } catch (IOException i) {
            try {
                File file = new File("scores.dat");
                file.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Read the scores from the file into a list of HashMap<String, Object>
        List<HashMap<String, Object>> scoresList = new ArrayList<>();
        try (Scanner scanner = new Scanner(new File(SCORES_FILE_NAME))) {
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                HashMap<String, Object> score = new Gson().fromJson(line, HashMap.class);
                scoresList.add(score);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        // Sort the scores by score in descending order
        scoresList.sort((o1, o2) -> Double.compare((Double) o2.get("score"), (Double) o1.get("score")));

        // Add only the lowest 5 scores to a new ArrayList
        List<HashMap<String, Object>> lowestScores = new ArrayList<>();
        for (int i = 0; i < Math.min(5, scoresList.size()); i++) {
            lowestScores.add(scoresList.get(i));
        }

        // Convert the lowest 5 scores to a JSON object and return it
        Gson gson = new Gson();
        String json = gson.toJson(lowestScores);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }



    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Parse the incoming JSON object
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        // Update the scores data structure
        String name = jsonObject.get("name").getAsString();
        int score = jsonObject.get("score").getAsInt();
        boolean updated = false;

        List<HashMap<String, Object>> scoresList = new ArrayList<>();
        try (Scanner scanner = new Scanner(new File(SCORES_FILE_NAME))) {
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                HashMap<String, Object> scoreData = gson.fromJson(line, HashMap.class);
                if (scoreData.get("name").equals(name)) {
                    if ((Integer) scoreData.get("score") > score) {
                        scoreData.put("score", score);
                        updated = true;
                    }
                }
                scoresList.add(scoreData);
            }
        } catch (FileNotFoundException e) {
            // If the file is not found, just log a warning and continue
            System.out.println("Warning: scores file not found");
        }

        if (!updated) {
            HashMap<String, Object> scoreData = new HashMap<>();
            scoreData.put("name", name);
            scoreData.put("score", score);
            scoresList.add(scoreData);
        }

        // Sort the scores by score in descending order

        //scoresList.sort((o1, o2) -> Integer.compare((int) o2.get("score"), (int) o1.get("score")));

        // Write the updated scores back to the file
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(SCORES_FILE_NAME))) {
            for (HashMap<String, Object> scoreData : scoresList) {
                String json = gson.toJson(scoreData);
                writer.write(json);
                writer.newLine();
            }
        } catch (IOException e) {
            // If there is an IO error while writing the file, log an error message
            System.err.println("Error writing scores file: " + e.getMessage());
            e.printStackTrace();
        }

        // Return a success message
        JsonObject result = new JsonObject();
        result.addProperty("success", true);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(result.toString());
    }


    @Override
    public void destroy() {
        // Save the high scores data structure to a file

    }
}




/*
package hac.javareact;

import java.io.*;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;

import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.util.Collections;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet(name = "ServletApi", value = "/api/highscores")
public class ApiServlet extends HttpServlet {
    private ArrayList<HashMap<String, Object>> highScores;
    private static final String SCORES_FILE_NAME = "scores.dat";
    @Override
    public void init() {
        // Initialize the high scores data structure by loading it from a file
        try(FileInputStream fileIn = new FileInputStream(SCORES_FILE_NAME);
            ObjectInputStream in = new ObjectInputStream(fileIn)) {

            highScores = (ArrayList<HashMap<String, Object>>) in.readObject();
            highScores.clear();
            in.close();
            fileIn.close();
        } catch (IOException i) {
            highScores = new ArrayList<HashMap<String, Object>>();
            try {
                File file = new File("scores.dat");
                file.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (ClassNotFoundException c) {
            System.out.println("Class not found");
            c.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Sort the high scores by score in descending order
        highScores.sort((o1, o2) -> Integer.compare((int) o1.get("score"), (int) o2.get("score")));

// Add only the lowest 5 scores to a new ArrayList
        ArrayList<HashMap<String, Object>> lowestScores = new ArrayList<>();
        for (int i = 0; i < Math.min(5, highScores.size()); i++) {
            lowestScores.add(highScores.get(i));
        }

// Convert the lowest 5 scores to a JSON object and return it
        Gson gson = new Gson();
        String json = gson.toJson(lowestScores);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);

    }


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Parse the incoming JSON object
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        // Update the high scores data structure
        String name = jsonObject.get("name").getAsString();
        int score = jsonObject.get("score").getAsInt();
        boolean updated = false;

        for (HashMap<String, Object> scoreData : highScores) {
            if (scoreData.get("name").equals(name)) {
                if ((int) scoreData.get("score") > score) {
                    scoreData.put("score", score);
                    updated = true;
                }
                break;
            }
        }

        if (!updated) {
            HashMap<String, Object> scoreData = new HashMap<>();
            scoreData.put("name", name);
            scoreData.put("score", score);
            highScores.add(scoreData);
        }

        // Return a success message
        JsonObject result = new JsonObject();
        result.addProperty("success", true);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(result.toString());
    }

    @Override
    public void destroy() {
        // Save the high scores data structure to a file
        try (FileOutputStream fileOut = new FileOutputStream(SCORES_FILE_NAME);
             ObjectOutputStream out = new ObjectOutputStream(fileOut);){

            out.writeObject(highScores);

            System.out.println("Serialized data is saved in " + SCORES_FILE_NAME);
        } catch (IOException i) {
            i.printStackTrace();
        }
    }
}
*/


