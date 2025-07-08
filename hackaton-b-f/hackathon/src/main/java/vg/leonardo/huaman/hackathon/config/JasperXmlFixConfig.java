package vg.leonardo.huaman.hackathon.config;

import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

@Configuration
public class JasperXmlFixConfig {
    
    @PostConstruct
    public void fixXmlParser() {
        System.setProperty(
            "javax.xml.parsers.DocumentBuilderFactory",
            "com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl"
        );
    }
    
}
