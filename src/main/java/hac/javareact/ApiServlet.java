package hac.javareact;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.*;
import javax.servlet.annotation.*;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet(name = "ServletApi", value = "/api/highscores")
public class ApiServlet extends HttpServlet {
    private ArrayList<HashMap<String, Object>> highScores;

    @Override
    public void init() {
        // Initialize the high scores data structure
        highScores = new ArrayList<>();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Read the high scores data structure and return it as a JSON object
        Gson gson = new Gson();
        String json = gson.toJson(highScores);
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
        HashMap<String, Object> scoreData = new HashMap<>();
        scoreData.put("name", name);
        scoreData.put("score", score);
        highScores.add(scoreData);

        // Return a success message
        JsonObject result = new JsonObject();
        result.addProperty("success", true);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(result.toString());
    }

    @Override
    public void destroy() {
        // Save the high scores data structure to a file or database
    }
}
