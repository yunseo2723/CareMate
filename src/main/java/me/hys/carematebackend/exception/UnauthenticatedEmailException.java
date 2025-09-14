package me.hys.carematebackend.exception;

public class UnauthenticatedEmailException extends RuntimeException{
    public UnauthenticatedEmailException(String message) {
        super(message);
    }
}
