package me.hys.carematebackend.exception;

public class UnverifiedCodeException extends RuntimeException{
    public UnverifiedCodeException(String message) {
        super(message);
    }
}
