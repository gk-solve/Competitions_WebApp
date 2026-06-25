package com.competitionswebapp;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Static frontend (HTML/CSS/JS), mirroring server/index.js, fastapi-server/main.py, and the
// ASP.NET Core Program.cs. Mounted per-directory rather than on the whole project root, so
// data/ and springboot-server/ (source, target/) are never reachable over HTTP.
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final ProjectPaths projectPaths;

    public WebConfig(ProjectPaths projectPaths) {
        this.projectPaths = projectPaths;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String root = "file:" + projectPaths.getRoot() + "/";

        registry.addResourceHandler("/css/**").addResourceLocations(root + "css/");
        registry.addResourceHandler("/js/**").addResourceLocations(root + "js/");
        registry.addResourceHandler("/assets/**").addResourceLocations(root + "assets/");

        for (String page : new String[] { "index.htm", "competitions.htm", "competitors.htm", "results.htm" }) {
            registry.addResourceHandler("/" + page).addResourceLocations(root);
        }
    }
}
