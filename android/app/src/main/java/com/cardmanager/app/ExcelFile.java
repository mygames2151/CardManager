package com.cardmanager.app;

public class ExcelFile {
    private int id;
    private String name;
    private String data;
    private long createdDate;
    
    public ExcelFile() {
    }
    
    public ExcelFile(String name, String data) {
        this.name = name;
        this.data = data;
        this.createdDate = System.currentTimeMillis();
    }
    
    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
    
    public long getCreatedDate() { return createdDate; }
    public void setCreatedDate(long createdDate) { this.createdDate = createdDate; }
}