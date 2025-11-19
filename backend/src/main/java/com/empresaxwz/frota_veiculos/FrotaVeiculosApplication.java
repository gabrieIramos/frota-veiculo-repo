package com.empresaxwz.frota_veiculos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FrotaVeiculosApplication {

	public static void main(String[] args) {
		SpringApplication.run(FrotaVeiculosApplication.class, args);
	}

}
