package com.minglemart.shared.infra;

import java.util.Map;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import org.springframework.util.StreamUtils;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.core.io.ClassPathResource;
@Component
public class TemplateRenderer {
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    public String render(String group, String name, Map<String, String> body) {
        String template = cache.computeIfAbsent(group + "/" + name, this::load);

        String rendered = template;
        for (Map.Entry<String, String> entry : body.entrySet()) {
            rendered = rendered.replace("{{" + entry.getKey() + "}}", entry.getValue() == null ? "" : entry.getValue());
        }

        return rendered;
    }

    private String load(String path) {
        ClassPathResource resource = new ClassPathResource("templates/" + path + ".html");

        if (!resource.exists()) {
            throw new IllegalStateException("no email template at resources/templates/%s.html".formatted(path));
        }

        try (var in = resource.getInputStream()) {
            return StreamUtils.copyToString(in, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new UncheckedIOException("could not read template " + path, e);
        }
    }
}
