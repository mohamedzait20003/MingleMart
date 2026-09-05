package com.minglemart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@ConfigurationPropertiesScan
@SpringBootApplication
public class MinglemartApplication {

	public static void main(String[] args) {
		SpringApplication.run(MinglemartApplication.class, args);
	}

}
