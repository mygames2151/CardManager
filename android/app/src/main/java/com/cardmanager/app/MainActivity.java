package com.cardmanager.app;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    
    private SharedPreferences prefs;
    private static final String PREFS_NAME = "CardManagerPrefs";
    private static final String KEY_PIN = "user_pin";
    private static final String DEFAULT_PIN = "2208";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        
        // Check if PIN is set, if not set default
        if (!prefs.contains(KEY_PIN)) {
            SharedPreferences.Editor editor = prefs.edit();
            editor.putString(KEY_PIN, DEFAULT_PIN);
            editor.apply();
        }
        
        // Check if user is authenticated
        if (!isAuthenticated()) {
            startActivity(new Intent(this, PinActivity.class));
            finish();
            return;
        }
        
        setupMainLayout();
    }
    
    private void setupMainLayout() {
        LinearLayout mainLayout = new LinearLayout(this);
        mainLayout.setOrientation(LinearLayout.VERTICAL);
        mainLayout.setPadding(40, 80, 40, 40);
        mainLayout.setBackgroundColor(0xFFFFFFFF);
        
        // Title
        android.widget.TextView title = new android.widget.TextView(this);
        title.setText("Card Manager");
        title.setTextSize(28);
        title.setTextColor(0xFF333333);
        title.setGravity(android.view.Gravity.CENTER);
        title.setPadding(0, 0, 0, 60);
        title.setTypeface(null, android.graphics.Typeface.BOLD);
        mainLayout.addView(title);
        
        // Cards Button
        Button cardsBtn = createMenuButton("Manage Cards", 0xFFADD8E6);
        cardsBtn.setOnClickListener(v -> startActivity(new Intent(this, CardsActivity.class)));
        mainLayout.addView(cardsBtn);
        
        // Excel Button
        Button excelBtn = createMenuButton("Excel Editor", 0xFFFFB6C1);
        excelBtn.setOnClickListener(v -> startActivity(new Intent(this, ExcelActivity.class)));
        mainLayout.addView(excelBtn);
        
        // Gallery Button
        Button galleryBtn = createMenuButton("Media Gallery", 0xFFADD8E6);
        galleryBtn.setOnClickListener(v -> startActivity(new Intent(this, GalleryActivity.class)));
        mainLayout.addView(galleryBtn);
        
        // Logout Button
        Button logoutBtn = createMenuButton("Logout", 0xFFDDDDDD);
        logoutBtn.setOnClickListener(v -> logout());
        mainLayout.addView(logoutBtn);
        
        setContentView(mainLayout);
    }
    
    private Button createMenuButton(String text, int color) {
        Button button = new Button(this);
        button.setText(text);
        button.setTextSize(18);
        button.setTextColor(0xFF333333);
        button.setBackgroundColor(color);
        button.setPadding(20, 30, 20, 30);
        
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        params.setMargins(0, 0, 0, 20);
        button.setLayoutParams(params);
        
        return button;
    }
    
    private boolean isAuthenticated() {
        return prefs.getBoolean("authenticated", false);
    }
    
    private void logout() {
        SharedPreferences.Editor editor = prefs.edit();
        editor.putBoolean("authenticated", false);
        editor.apply();
        
        startActivity(new Intent(this, PinActivity.class));
        finish();
    }
}