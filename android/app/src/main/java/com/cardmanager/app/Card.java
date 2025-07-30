package com.cardmanager.app;

public class Card {
    private int id;
    private String code;
    private String name;
    private String gender;
    private String phone;
    private String email;
    private String address;
    private String photo;
    private String idFront;
    private String idBack;
    private String notes;
    private String birthday;
    
    public Card() {
    }
    
    public Card(String code, String name, String gender, String phone, String email, 
                String address, String photo, String idFront, String idBack, 
                String notes, String birthday) {
        this.code = code;
        this.name = name;
        this.gender = gender;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.photo = photo;
        this.idFront = idFront;
        this.idBack = idBack;
        this.notes = notes;
        this.birthday = birthday;
    }
    
    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
    
    public String getIdFront() { return idFront; }
    public void setIdFront(String idFront) { this.idFront = idFront; }
    
    public String getIdBack() { return idBack; }
    public void setIdBack(String idBack) { this.idBack = idBack; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getBirthday() { return birthday; }
    public void setBirthday(String birthday) { this.birthday = birthday; }
}