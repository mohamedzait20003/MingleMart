package com.minglemart.integration;

import com.minglemart.MinglemartApplication;

import org.springframework.boot.SpringApplication;

public class TestMinglemartApplication {

	public static void main(String[] args) {
		SpringApplication.from(MinglemartApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
