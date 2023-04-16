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

    @Override
    public void init() {
        // Initialize the high scores data structure by loading it from a file
        try {
            FileInputStream fileIn = new FileInputStream("highscores.ser");
            ObjectInputStream in = new ObjectInputStream(fileIn);
            highScores = (ArrayList<HashMap<String, Object>>) in.readObject();
            //highScores.clear();
            in.close();
            fileIn.close();
        } catch (IOException i) {
            highScores = new ArrayList<HashMap<String, Object>>();
        } catch (ClassNotFoundException c) {
            System.out.println("Class not found");
            c.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Sort the high scores by score in descending order
        Collections.sort(highScores, new Comparator<HashMap<String, Object>>() {
            @Override
            public int compare(HashMap<String, Object> o1, HashMap<String, Object> o2) {
                return Integer.compare((int) o1.get("score"), (int) o2.get("score"));
            }
        });

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
                if ((int) scoreData.get("score") < score) {
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
        try {
            FileOutputStream fileOut = new FileOutputStream("highscores.ser");
            ObjectOutputStream out = new ObjectOutputStream(fileOut);
            out.writeObject(highScores);
            out.close();
            fileOut.close();
            System.out.println("Serialized data is saved in highscores.ser");
        } catch (IOException i) {
            i.printStackTrace();
        }
    }
}




/*
package hac.javareact;

import com.google.gson.Gson;

import java.io.*;
import java.util.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet(name = "ServletApi", value = "/api/highscores")
public class ApiServlet extends HttpServlet {

    private static final String SCORES_FILE_NAME = "scores.dat";
    private static final int MAX_HIGH_SCORES = 5;

    private List<HighScore> highScores;

    private Object lock;

    @Override
    public void init() throws ServletException {
        super.init();
        loadHighScores();
        lock = new Object();
    }

    private void loadHighScores() {
        synchronized (lock) {
            try (ObjectInputStream ois = new ObjectInputStream(
                    new FileInputStream(getServletContext().getRealPath(".") + File.separator + SCORES_FILE_NAME))) {
                highScores = (List<HighScore>) ois.readObject();
            } catch (IOException | ClassNotFoundException e) {
                highScores = new ArrayList<>();
            }
        }
    }

    private void saveHighScores() {
        synchronized (lock) {
            try (ObjectOutputStream oos = new ObjectOutputStream(
                    new FileOutputStream(getServletContext().getRealPath(".") + File.separator + SCORES_FILE_NAME))) {
                oos.writeObject(highScores);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        synchronized (lock) {
            // Sort the high scores by number of guesses in ascending order
            Collections.sort(highScores);

            // Add only the top MAX_HIGH_SCORES scores to a new ArrayList
            List<HighScore> topScores = new ArrayList<>();
            for (int i = 0; i < Math.min(MAX_HIGH_SCORES, highScores.size()); i++) {
                topScores.add(highScores.get(i));
            }

            // Convert the top scores to a JSON object and return it
            Gson gson = new Gson();
            String json = gson.toJson(topScores);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        synchronized (lock) {
            String userName = request.getParameter("user");
            int score = Integer.parseInt(request.getParameter("score"));

            // Check for duplicate user names
            for (HighScore hs : highScores) {
                if (hs.getUserName().equals(userName)) {
                    response.sendError(HttpServletResponse.SC_CONFLICT, "User name already exists in high scores.");
                    return;
                }
            }

            // Create a new high score object and add it to the list
            HighScore newHighScore = new HighScore(userName, score);
            highScores.add(newHighScore);

            // Sort the high scores by number of guesses in ascending order
            Collections.sort(highScores);

            // Remove any extra high scores above MAX_HIGH_SCORES
            while (highScores.size() > MAX_HIGH_SCORES) {
                highScores.remove(highScores.size() - 1);
            }

            // Save the updated high scores to the file
            saveHighScores();

            // Return a success message to the client
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("text/plain");
            response.getWriter().write("High score added successfully.");
        }
    }

    private static class HighScore implements Serializable, Comparable<HighScore> {
        private static final long serialVersionUID = 1L;
        private String userName;
        private int score;

        public HighScore(String userName, int score) {
            this.userName = userName;
            this.score = score;
        }

        public String getUserName() {
            return userName;
        }

        public int getScore() {
            return score;
        }

        @Override
        public int compareTo(HighScore o) {
            return Integer.compare(score, o.score);
        }

        @Override
        public boolean equals(Object obj) {
            if (obj == null) {
                return false;
            }
            if (getClass() != obj.getClass()) {
                return false;
            }
            final HighScore other = (HighScore) obj;
            if (!Objects.equals(this.userName, other.userName)) {
                return false;
            }
            return true;
        }

        @Override
        public int hashCode() {
            int hash = 7;
            hash = 47 * hash + Objects.hashCode(this.userName);
            return hash;
        }
    }
}
*/


