package hac.javareact;

import java.io.*;
import java.util.*;

import javax.servlet.http.*;
import javax.servlet.annotation.*;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

/**
 * This servlet handles the API requests for the high scores.
 * It reads and writes the high scores to a file.
 * It also sorts the high scores by score in descending order.
 * It returns the lowest 5 scores in the response.
 * It also updates the high scores if a new score is higher than the old score.
 */
@WebServlet(name = "ServletApi", value = "/api/highscores")
public class ApiServlet extends HttpServlet {
    private static final String SCORES_FILE_NAME = "scores.dat";

    /**
     * This method is called when the servlet is first initialized.
     * It loads the high scores from the file into the high scores data structure.
     */
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

    /**
     * This method is called when the servlet receives a GET request.
     * It returns the lowest 5 scores in the response.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Read the scores from the file into a list of HashMap<String, Object>
        ArrayList<HashMap<String, Object>> scoresList = getHighScores();

        // Sort the scores by score in descending order
        scoresList.sort((o1, o2) -> Double.compare((Double) o1.get("score"), (Double) o2.get("score")));

        // Add only the lowest 5 scores to a new ArrayList
        ArrayList<HashMap<String, Object>> lowestScores = new ArrayList<>();
        for (int i = 0; i < Math.min(5, scoresList.size()); i++)
            lowestScores.add(scoresList.get(i));

        // Convert the lowest 5 scores to a JSON object and return it
        Gson gson = new Gson();
        String json = gson.toJson(lowestScores);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }


    /**
     * This method is called when the servlet receives a POST request.
     * It updates the high scores if a new score is higher than the old score.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Parse the incoming JSON object
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        // Update the scores data structure
        String name = jsonObject.get("name").getAsString();
        int score = jsonObject.get("score").getAsInt();

       ArrayList<HashMap<String, Object>> scoresList = getHighScores();

        if(!checkForUpdate(getHighScores(), name, score)){
            HashMap<String, Object> scoreData = new HashMap<>();
            scoreData.put("name", name);
            scoreData.put("score", score);
            scoresList.add(scoreData);
        }

        // Write the updated scores back to the file
        writeToMemoryFile(scoresList);

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

    /**
     * This method reads the high scores from the file into a list of HashMap<String, Object>.
     * @return the list of high scores
     */
    private  ArrayList<HashMap<String, Object>> getHighScores() {
        // Read the scores from the file into a list of HashMap<String, Object>
        ArrayList<HashMap<String, Object>> scoresList = new ArrayList<>();
        synchronized
         (ApiServlet.class) {
            try (Scanner scanner = new Scanner(new File(SCORES_FILE_NAME))) {
                while (scanner.hasNextLine()) {
                    String line = scanner.nextLine();
                    HashMap<String, Object> score = new Gson().fromJson(line, HashMap.class);
                    scoresList.add(score);
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
        }
        return scoresList;
    }

    /**
     * This method checks if the name is already in the list of scores.
     * If it is, it checks if the score is higher than the old score.
     * If it is, it updates the score.
     * @param scoresList the list of scores
     * @param name the name to check
     * @param score the score to check
     * @return true if the name was found in the list of scores, false otherwise
     */
    private boolean checkForUpdate(ArrayList<HashMap<String, Object>> scoresList, String name, int score){
        for(HashMap<String, Object> scoreData : scoresList) {
            if (scoreData.get("name").equals(name)) {
                if ((Double) scoreData.get("score") > score)
                    scoreData.put("score", score);
                return true;
            }
        }
        return false;
    }

    /**
     * This method writes the high scores to the file.
     * @param scoresList the list of scores to write
     */
    private void writeToMemoryFile(ArrayList<HashMap<String, Object>> scoresList) {
        synchronized(ApiServlet.class) {
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(SCORES_FILE_NAME))) {
                for (HashMap<String, Object> scoreData : scoresList) {
                    String json = new Gson().toJson(scoreData);
                    writer.write(json);
                    writer.newLine();
                }
            } catch (IOException e) {
                // If there is an IO error while writing the file, log an error message
                System.err.println("Error writing scores file: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}


