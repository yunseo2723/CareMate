package me.hys.carematebackend.exception;

public class CodeExpiredException extends RuntimeException{
    public CodeExpiredException(String message) {
        super(message);
    }
}
