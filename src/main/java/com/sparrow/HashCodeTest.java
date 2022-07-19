package com.sparrow;

public class HashCodeTest {
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            System.out.println(new Object().hashCode());
        }
    }
}
