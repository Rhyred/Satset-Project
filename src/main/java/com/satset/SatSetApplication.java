package com.satset;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SatSetApplication {
	public static void main(String[] args) {
		SpringApplication.run(SatSetApplication.class, args);
	}
}
