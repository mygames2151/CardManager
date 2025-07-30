package com.cardmanager.app;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import java.util.ArrayList;
import java.util.List;

public class DatabaseHelper extends SQLiteOpenHelper {
    
    private static final String DATABASE_NAME = "CardManager.db";
    private static final int DATABASE_VERSION = 1;
    
    // Cards Table
    private static final String TABLE_CARDS = "cards";
    private static final String CARD_ID = "id";
    private static final String CARD_CODE = "code";
    private static final String CARD_NAME = "name";
    private static final String CARD_GENDER = "gender";
    private static final String CARD_PHONE = "phone";
    private static final String CARD_EMAIL = "email";
    private static final String CARD_ADDRESS = "address";
    private static final String CARD_PHOTO = "photo";
    private static final String CARD_ID_FRONT = "id_front";
    private static final String CARD_ID_BACK = "id_back";
    private static final String CARD_NOTES = "notes";
    private static final String CARD_BIRTHDAY = "birthday";
    
    // Excel Files Table
    private static final String TABLE_EXCEL = "excel_files";
    private static final String EXCEL_ID = "id";
    private static final String EXCEL_NAME = "name";
    private static final String EXCEL_DATA = "data";
    private static final String EXCEL_CREATED = "created_date";
    
    // Media Table
    private static final String TABLE_MEDIA = "media";
    private static final String MEDIA_ID = "id";
    private static final String MEDIA_CARD_ID = "card_id";
    private static final String MEDIA_NAME = "name";
    private static final String MEDIA_TYPE = "type";
    private static final String MEDIA_DATA = "data";
    private static final String MEDIA_CREATED = "created_date";
    
    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }
    
    @Override
    public void onCreate(SQLiteDatabase db) {
        // Create Cards Table
        String createCardsTable = "CREATE TABLE " + TABLE_CARDS + "("
                + CARD_ID + " INTEGER PRIMARY KEY AUTOINCREMENT,"
                + CARD_CODE + " TEXT UNIQUE,"
                + CARD_NAME + " TEXT,"
                + CARD_GENDER + " TEXT,"
                + CARD_PHONE + " TEXT,"
                + CARD_EMAIL + " TEXT,"
                + CARD_ADDRESS + " TEXT,"
                + CARD_PHOTO + " TEXT,"
                + CARD_ID_FRONT + " TEXT,"
                + CARD_ID_BACK + " TEXT,"
                + CARD_NOTES + " TEXT,"
                + CARD_BIRTHDAY + " TEXT"
                + ")";
        db.execSQL(createCardsTable);
        
        // Create Excel Files Table
        String createExcelTable = "CREATE TABLE " + TABLE_EXCEL + "("
                + EXCEL_ID + " INTEGER PRIMARY KEY AUTOINCREMENT,"
                + EXCEL_NAME + " TEXT,"
                + EXCEL_DATA + " TEXT,"
                + EXCEL_CREATED + " INTEGER"
                + ")";
        db.execSQL(createExcelTable);
        
        // Create Media Table
        String createMediaTable = "CREATE TABLE " + TABLE_MEDIA + "("
                + MEDIA_ID + " INTEGER PRIMARY KEY AUTOINCREMENT,"
                + MEDIA_CARD_ID + " INTEGER,"
                + MEDIA_NAME + " TEXT,"
                + MEDIA_TYPE + " TEXT,"
                + MEDIA_DATA + " TEXT,"
                + MEDIA_CREATED + " INTEGER,"
                + "FOREIGN KEY(" + MEDIA_CARD_ID + ") REFERENCES " + TABLE_CARDS + "(" + CARD_ID + ")"
                + ")";
        db.execSQL(createMediaTable);
    }
    
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_CARDS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_EXCEL);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_MEDIA);
        onCreate(db);
    }
    
    // Card CRUD Operations
    public long addCard(Card card) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        
        values.put(CARD_CODE, card.getCode());
        values.put(CARD_NAME, card.getName());
        values.put(CARD_GENDER, card.getGender());
        values.put(CARD_PHONE, card.getPhone());
        values.put(CARD_EMAIL, card.getEmail());
        values.put(CARD_ADDRESS, card.getAddress());
        values.put(CARD_PHOTO, card.getPhoto());
        values.put(CARD_ID_FRONT, card.getIdFront());
        values.put(CARD_ID_BACK, card.getIdBack());
        values.put(CARD_NOTES, card.getNotes());
        values.put(CARD_BIRTHDAY, card.getBirthday());
        
        long id = db.insert(TABLE_CARDS, null, values);
        db.close();
        return id;
    }
    
    public List<Card> getAllCards() {
        List<Card> cardList = new ArrayList<>();
        String selectQuery = "SELECT * FROM " + TABLE_CARDS + " ORDER BY " + CARD_NAME;
        
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery(selectQuery, null);
        
        if (cursor.moveToFirst()) {
            do {
                Card card = new Card();
                card.setId(cursor.getInt(0));
                card.setCode(cursor.getString(1));
                card.setName(cursor.getString(2));
                card.setGender(cursor.getString(3));
                card.setPhone(cursor.getString(4));
                card.setEmail(cursor.getString(5));
                card.setAddress(cursor.getString(6));
                card.setPhoto(cursor.getString(7));
                card.setIdFront(cursor.getString(8));
                card.setIdBack(cursor.getString(9));
                card.setNotes(cursor.getString(10));
                card.setBirthday(cursor.getString(11));
                
                cardList.add(card);
            } while (cursor.moveToNext());
        }
        
        cursor.close();
        db.close();
        return cardList;
    }
    
    public int updateCard(Card card) {
        SQLiteDatabase db = this.getWritableDatabase();
        
        ContentValues values = new ContentValues();
        values.put(CARD_CODE, card.getCode());
        values.put(CARD_NAME, card.getName());
        values.put(CARD_GENDER, card.getGender());
        values.put(CARD_PHONE, card.getPhone());
        values.put(CARD_EMAIL, card.getEmail());
        values.put(CARD_ADDRESS, card.getAddress());
        values.put(CARD_PHOTO, card.getPhoto());
        values.put(CARD_ID_FRONT, card.getIdFront());
        values.put(CARD_ID_BACK, card.getIdBack());
        values.put(CARD_NOTES, card.getNotes());
        values.put(CARD_BIRTHDAY, card.getBirthday());
        
        int rowsAffected = db.update(TABLE_CARDS, values, CARD_ID + " = ?",
                new String[]{String.valueOf(card.getId())});
        db.close();
        return rowsAffected;
    }
    
    public void deleteCard(Card card) {
        SQLiteDatabase db = this.getWritableDatabase();
        db.delete(TABLE_CARDS, CARD_ID + " = ?",
                new String[]{String.valueOf(card.getId())});
        db.close();
    }
    
    // Excel CRUD Operations
    public long addExcelFile(String name, String data) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        
        values.put(EXCEL_NAME, name);
        values.put(EXCEL_DATA, data);
        values.put(EXCEL_CREATED, System.currentTimeMillis());
        
        long id = db.insert(TABLE_EXCEL, null, values);
        db.close();
        return id;
    }
    
    public List<ExcelFile> getAllExcelFiles() {
        List<ExcelFile> fileList = new ArrayList<>();
        String selectQuery = "SELECT * FROM " + TABLE_EXCEL + " ORDER BY " + EXCEL_CREATED + " DESC";
        
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery(selectQuery, null);
        
        if (cursor.moveToFirst()) {
            do {
                ExcelFile file = new ExcelFile();
                file.setId(cursor.getInt(0));
                file.setName(cursor.getString(1));
                file.setData(cursor.getString(2));
                file.setCreatedDate(cursor.getLong(3));
                
                fileList.add(file);
            } while (cursor.moveToNext());
        }
        
        cursor.close();
        db.close();
        return fileList;
    }
}