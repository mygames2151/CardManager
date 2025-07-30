package com.cardmanager.app;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

public class PinActivity extends AppCompatActivity {
    
    private SharedPreferences prefs;
    private static final String PREFS_NAME = "CardManagerPrefs";
    private static final String KEY_PIN = "user_pin";
    private static final String SECURITY_QUESTION = "what use of app";
    private static final String SECURITY_ANSWER = "LUDO";
    
    private EditText pinInput;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        setupPinLayout();
    }
    
    private void setupPinLayout() {
        LinearLayout mainLayout = new LinearLayout(this);
        mainLayout.setOrientation(LinearLayout.VERTICAL);
        mainLayout.setPadding(40, 120, 40, 40);
        mainLayout.setBackgroundColor(0xFFFFFFFF);
        mainLayout.setGravity(android.view.Gravity.CENTER);
        
        // App Title
        TextView title = new TextView(this);
        title.setText("Card Manager");
        title.setTextSize(32);
        title.setTextColor(0xFF333333);
        title.setGravity(android.view.Gravity.CENTER);
        title.setPadding(0, 0, 0, 40);
        title.setTypeface(null, android.graphics.Typeface.BOLD);
        mainLayout.addView(title);
        
        // Lock Icon (Using text for simplicity)
        TextView lockIcon = new TextView(this);
        lockIcon.setText("🔒");
        lockIcon.setTextSize(48);
        lockIcon.setGravity(android.view.Gravity.CENTER);
        lockIcon.setPadding(0, 0, 0, 30);
        mainLayout.addView(lockIcon);
        
        // PIN Label
        TextView pinLabel = new TextView(this);
        pinLabel.setText("Enter Your PIN");
        pinLabel.setTextSize(18);
        pinLabel.setTextColor(0xFF666666);
        pinLabel.setGravity(android.view.Gravity.CENTER);
        pinLabel.setPadding(0, 0, 0, 20);
        mainLayout.addView(pinLabel);
        
        // PIN Input
        pinInput = new EditText(this);
        pinInput.setHint("PIN");
        pinInput.setTextSize(20);
        pinInput.setGravity(android.view.Gravity.CENTER);
        pinInput.setPadding(20, 20, 20, 20);
        pinInput.setBackgroundColor(0xFFF0F0F0);
        pinInput.setInputType(android.text.InputType.TYPE_CLASS_NUMBER | android.text.InputType.TYPE_NUMBER_VARIATION_PASSWORD);
        
        LinearLayout.LayoutParams inputParams = new LinearLayout.LayoutParams(
            300, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        inputParams.setMargins(0, 0, 0, 30);
        inputParams.gravity = android.view.Gravity.CENTER;
        pinInput.setLayoutParams(inputParams);
        mainLayout.addView(pinInput);
        
        // Login Button
        Button loginBtn = new Button(this);
        loginBtn.setText("LOGIN");
        loginBtn.setTextSize(18);
        loginBtn.setTextColor(0xFFFFFFFF);
        loginBtn.setBackgroundColor(0xFFADD8E6);
        loginBtn.setPadding(40, 20, 40, 20);
        loginBtn.setTypeface(null, android.graphics.Typeface.BOLD);
        
        LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(
            300, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        btnParams.setMargins(0, 0, 0, 20);
        btnParams.gravity = android.view.Gravity.CENTER;
        loginBtn.setLayoutParams(btnParams);
        
        loginBtn.setOnClickListener(v -> verifyPin());
        mainLayout.addView(loginBtn);
        
        // Forgot PIN Button
        Button forgotBtn = new Button(this);
        forgotBtn.setText("Forgot PIN?");
        forgotBtn.setTextSize(14);
        forgotBtn.setTextColor(0xFF666666);
        forgotBtn.setBackgroundColor(0x00000000);
        forgotBtn.setOnClickListener(v -> showSecurityQuestion());
        mainLayout.addView(forgotBtn);
        
        setContentView(mainLayout);
    }
    
    private void verifyPin() {
        String enteredPin = pinInput.getText().toString().trim();
        String savedPin = prefs.getString(KEY_PIN, "2208");
        
        if (enteredPin.equals(savedPin)) {
            // Authentication successful
            SharedPreferences.Editor editor = prefs.edit();
            editor.putBoolean("authenticated", true);
            editor.apply();
            
            startActivity(new Intent(this, MainActivity.class));
            finish();
        } else {
            Toast.makeText(this, "Invalid PIN. Please try again.", Toast.LENGTH_SHORT).show();
            pinInput.setText("");
        }
    }
    
    private void showSecurityQuestion() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Security Question");
        builder.setMessage(SECURITY_QUESTION + "?");
        
        final EditText input = new EditText(this);
        input.setHint("Enter answer");
        builder.setView(input);
        
        builder.setPositiveButton("Reset PIN", (dialog, which) -> {
            String answer = input.getText().toString().trim();
            if (answer.equalsIgnoreCase(SECURITY_ANSWER)) {
                resetPin();
            } else {
                Toast.makeText(this, "Incorrect answer.", Toast.LENGTH_SHORT).show();
            }
        });
        
        builder.setNegativeButton("Cancel", null);
        builder.show();
    }
    
    private void resetPin() {
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString(KEY_PIN, "2208");
        editor.apply();
        
        Toast.makeText(this, "PIN reset to default: 2208", Toast.LENGTH_LONG).show();
    }
}