package com.minglemart.integration;

import com.minglemart.MinglemartApplication;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class MinglemartApplicationTests {

	@Test
	void contextLoads() {
	}

}
