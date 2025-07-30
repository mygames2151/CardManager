package com.cardmanager.app;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.util.List;
import java.util.Random;

public class CardsActivity extends AppCompatActivity {
    
    private DatabaseHelper dbHelper;
    private LinearLayout cardsContainer;
    private EditText searchInput;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        dbHelper = new DatabaseHelper(this);
        setupCardsLayout();
        loadCards();
    }
    
    private void setupCardsLayout() {
        LinearLayout mainLayout = new LinearLayout(this);
        mainLayout.setOrientation(LinearLayout.VERTICAL);
        mainLayout.setPadding(20, 40, 20, 20);
        mainLayout.setBackgroundColor(0xFFFFFFFF);
        
        // Header
        LinearLayout headerLayout = new LinearLayout(this);
        headerLayout.setOrientation(LinearLayout.HORIZONTAL);
        headerLayout.setPadding(0, 0, 0, 20);
        
        // Back Button
        Button backBtn = new Button(this);
        backBtn.setText("← Back");
        backBtn.setTextColor(0xFF666666);
        backBtn.setBackgroundColor(0x00000000);
        backBtn.setOnClickListener(v -> finish());
        headerLayout.addView(backBtn);
        
        // Title
        TextView title = new TextView(this);
        title.setText("Manage Cards");
        title.setTextSize(24);
        title.setTextColor(0xFF333333);
        title.setTypeface(null, android.graphics.Typeface.BOLD);
        title.setPadding(20, 0, 0, 0);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
            0, LinearLayout.LayoutParams.WRAP_CONTENT, 1.0f
        );
        title.setLayoutParams(titleParams);
        headerLayout.addView(title);
        
        mainLayout.addView(headerLayout);
        
        // Search Bar
        searchInput = new EditText(this);
        searchInput.setHint("Search cards...");
        searchInput.setPadding(20, 15, 20, 15);
        searchInput.setBackgroundColor(0xFFF0F0F0);
        searchInput.addTextChangedListener(new android.text.TextWatcher() {
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            public void onTextChanged(CharSequence s, int start, int before, int count) {}
            public void afterTextChanged(android.text.Editable s) {
                filterCards(s.toString());
            }
        });
        
        LinearLayout.LayoutParams searchParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        searchParams.setMargins(0, 0, 0, 20);
        searchInput.setLayoutParams(searchParams);
        mainLayout.addView(searchInput);
        
        // Add New Card Button
        Button addBtn = new Button(this);
        addBtn.setText("+ Add New Card");
        addBtn.setTextSize(16);
        addBtn.setTextColor(0xFFFFFFFF);
        addBtn.setBackgroundColor(0xFFADD8E6);
        addBtn.setPadding(20, 15, 20, 15);
        addBtn.setOnClickListener(v -> showAddCardDialog());
        
        LinearLayout.LayoutParams addBtnParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        addBtnParams.setMargins(0, 0, 0, 20);
        addBtn.setLayoutParams(addBtnParams);
        mainLayout.addView(addBtn);
        
        // Cards Container (Scrollable)
        ScrollView scrollView = new ScrollView(this);
        cardsContainer = new LinearLayout(this);
        cardsContainer.setOrientation(LinearLayout.VERTICAL);
        scrollView.addView(cardsContainer);
        
        LinearLayout.LayoutParams scrollParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, 0, 1.0f
        );
        scrollView.setLayoutParams(scrollParams);
        mainLayout.addView(scrollView);
        
        setContentView(mainLayout);
    }
    
    private void loadCards() {
        cardsContainer.removeAllViews();
        List<Card> cards = dbHelper.getAllCards();
        
        if (cards.isEmpty()) {
            TextView emptyMsg = new TextView(this);
            emptyMsg.setText("No cards found. Add your first card!");
            emptyMsg.setTextSize(16);
            emptyMsg.setTextColor(0xFF666666);
            emptyMsg.setGravity(android.view.Gravity.CENTER);
            emptyMsg.setPadding(20, 40, 20, 40);
            cardsContainer.addView(emptyMsg);
            return;
        }
        
        for (Card card : cards) {
            addCardView(card);
        }
    }
    
    private void addCardView(Card card) {
        LinearLayout cardLayout = new LinearLayout(this);
        cardLayout.setOrientation(LinearLayout.VERTICAL);
        cardLayout.setPadding(20, 15, 20, 15);
        cardLayout.setBackgroundColor(card.getGender().equals("male") ? 0xFFADD8E6 : 0xFFFFB6C1);
        
        LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        cardParams.setMargins(0, 0, 0, 10);
        cardLayout.setLayoutParams(cardParams);
        
        // Card Header
        LinearLayout headerLayout = new LinearLayout(this);
        headerLayout.setOrientation(LinearLayout.HORIZONTAL);
        
        TextView nameText = new TextView(this);
        nameText.setText(card.getName() + " (" + card.getCode() + ")");
        nameText.setTextSize(18);
        nameText.setTextColor(0xFF333333);
        nameText.setTypeface(null, android.graphics.Typeface.BOLD);
        
        LinearLayout.LayoutParams nameParams = new LinearLayout.LayoutParams(
            0, LinearLayout.LayoutParams.WRAP_CONTENT, 1.0f
        );
        nameText.setLayoutParams(nameParams);
        headerLayout.addView(nameText);
        
        // Edit Button
        Button editBtn = new Button(this);
        editBtn.setText("Edit");
        editBtn.setTextSize(12);
        editBtn.setTextColor(0xFF333333);
        editBtn.setBackgroundColor(0xFFFFFFFF);
        editBtn.setPadding(15, 5, 15, 5);
        editBtn.setOnClickListener(v -> showEditCardDialog(card));
        headerLayout.addView(editBtn);
        
        // Delete Button
        Button deleteBtn = new Button(this);
        deleteBtn.setText("Delete");
        deleteBtn.setTextSize(12);
        deleteBtn.setTextColor(0xFFFFFFFF);
        deleteBtn.setBackgroundColor(0xFFFF6B6B);
        deleteBtn.setPadding(15, 5, 15, 5);
        deleteBtn.setOnClickListener(v -> confirmDelete(card));
        headerLayout.addView(deleteBtn);
        
        cardLayout.addView(headerLayout);
        
        // Card Details
        if (card.getPhone() != null && !card.getPhone().isEmpty()) {
            TextView phoneText = new TextView(this);
            phoneText.setText("📞 " + card.getPhone());
            phoneText.setTextSize(14);
            phoneText.setTextColor(0xFF333333);
            phoneText.setPadding(0, 5, 0, 0);
            cardLayout.addView(phoneText);
        }
        
        if (card.getEmail() != null && !card.getEmail().isEmpty()) {
            TextView emailText = new TextView(this);
            emailText.setText("✉️ " + card.getEmail());
            emailText.setTextSize(14);
            emailText.setTextColor(0xFF333333);
            emailText.setPadding(0, 5, 0, 0);
            cardLayout.addView(emailText);
        }
        
        cardsContainer.addView(cardLayout);
    }
    
    private void showAddCardDialog() {
        showCardDialog(null);
    }
    
    private void showEditCardDialog(Card card) {
        showCardDialog(card);
    }
    
    private void showCardDialog(Card existingCard) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(existingCard == null ? "Add New Card" : "Edit Card");
        
        ScrollView scrollView = new ScrollView(this);
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(20, 20, 20, 20);
        
        // Name
        EditText nameInput = new EditText(this);
        nameInput.setHint("Full Name *");
        nameInput.setText(existingCard != null ? existingCard.getName() : "");
        layout.addView(nameInput);
        
        // Gender
        android.widget.Spinner genderSpinner = new android.widget.Spinner(this);
        android.widget.ArrayAdapter<String> genderAdapter = new android.widget.ArrayAdapter<>(
            this, android.R.layout.simple_spinner_item, new String[]{"male", "female"}
        );
        genderAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        genderSpinner.setAdapter(genderAdapter);
        if (existingCard != null && existingCard.getGender().equals("female")) {
            genderSpinner.setSelection(1);
        }
        layout.addView(genderSpinner);
        
        // Phone
        EditText phoneInput = new EditText(this);
        phoneInput.setHint("Phone Number");
        phoneInput.setText(existingCard != null ? existingCard.getPhone() : "");
        phoneInput.setInputType(android.text.InputType.TYPE_CLASS_PHONE);
        layout.addView(phoneInput);
        
        // Email
        EditText emailInput = new EditText(this);
        emailInput.setHint("Email Address");
        emailInput.setText(existingCard != null ? existingCard.getEmail() : "");
        emailInput.setInputType(android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
        layout.addView(emailInput);
        
        // Address
        EditText addressInput = new EditText(this);
        addressInput.setHint("Address");
        addressInput.setText(existingCard != null ? existingCard.getAddress() : "");
        layout.addView(addressInput);
        
        // Birthday
        EditText birthdayInput = new EditText(this);
        birthdayInput.setHint("Birthday (YYYY-MM-DD)");
        birthdayInput.setText(existingCard != null ? existingCard.getBirthday() : "");
        layout.addView(birthdayInput);
        
        // Notes
        EditText notesInput = new EditText(this);
        notesInput.setHint("Notes");
        notesInput.setText(existingCard != null ? existingCard.getNotes() : "");
        notesInput.setLines(3);
        layout.addView(notesInput);
        
        scrollView.addView(layout);
        builder.setView(scrollView);
        
        builder.setPositiveButton("Save", (dialog, which) -> {
            String name = nameInput.getText().toString().trim();
            if (name.isEmpty()) {
                android.widget.Toast.makeText(this, "Name is required", android.widget.Toast.LENGTH_SHORT).show();
                return;
            }
            
            Card card = existingCard != null ? existingCard : new Card();
            if (existingCard == null) {
                card.setCode(generateCardCode());
            }
            
            card.setName(name);
            card.setGender(genderSpinner.getSelectedItem().toString());
            card.setPhone(phoneInput.getText().toString().trim());
            card.setEmail(emailInput.getText().toString().trim());
            card.setAddress(addressInput.getText().toString().trim());
            card.setBirthday(birthdayInput.getText().toString().trim());
            card.setNotes(notesInput.getText().toString().trim());
            
            if (existingCard == null) {
                dbHelper.addCard(card);
            } else {
                dbHelper.updateCard(card);
            }
            
            loadCards();
        });
        
        builder.setNegativeButton("Cancel", null);
        builder.show();
    }
    
    private void confirmDelete(Card card) {
        new AlertDialog.Builder(this)
            .setTitle("Delete Card")
            .setMessage("Are you sure you want to delete " + card.getName() + "?")
            .setPositiveButton("Delete", (dialog, which) -> {
                dbHelper.deleteCard(card);
                loadCards();
            })
            .setNegativeButton("Cancel", null)
            .show();
    }
    
    private String generateCardCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 3; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        return code.toString();
    }
    
    private void filterCards(String query) {
        // Simple filter implementation - in real app you'd query database
        loadCards();
    }
}