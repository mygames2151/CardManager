package com.cardmanager.app;

import android.app.AlertDialog;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.util.List;

public class GalleryActivity extends AppCompatActivity {
    
    private DatabaseHelper dbHelper;
    private LinearLayout galleryContainer;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        dbHelper = new DatabaseHelper(this);
        setupGalleryLayout();
        loadGallery();
    }
    
    private void setupGalleryLayout() {
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
        title.setText("Media Gallery");
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
        
        // Add Media Button
        Button addBtn = new Button(this);
        addBtn.setText("+ Add Media");
        addBtn.setTextSize(16);
        addBtn.setTextColor(0xFFFFFFFF);
        addBtn.setBackgroundColor(0xFFADD8E6);
        addBtn.setPadding(20, 15, 20, 15);
        addBtn.setOnClickListener(v -> showAddMediaDialog());
        
        LinearLayout.LayoutParams addBtnParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        addBtnParams.setMargins(0, 0, 0, 20);
        addBtn.setLayoutParams(addBtnParams);
        mainLayout.addView(addBtn);
        
        // Gallery Container (Scrollable)
        ScrollView scrollView = new ScrollView(this);
        galleryContainer = new LinearLayout(this);
        galleryContainer.setOrientation(LinearLayout.VERTICAL);
        scrollView.addView(galleryContainer);
        
        LinearLayout.LayoutParams scrollParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, 0, 1.0f
        );
        scrollView.setLayoutParams(scrollParams);
        mainLayout.addView(scrollView);
        
        setContentView(mainLayout);
    }
    
    private void loadGallery() {
        galleryContainer.removeAllViews();
        
        // Get all cards to organize media by card
        List<Card> cards = dbHelper.getAllCards();
        
        if (cards.isEmpty()) {
            TextView emptyMsg = new TextView(this);
            emptyMsg.setText("No cards found. Create cards first to organize media.");
            emptyMsg.setTextSize(16);
            emptyMsg.setTextColor(0xFF666666);
            emptyMsg.setGravity(android.view.Gravity.CENTER);
            emptyMsg.setPadding(20, 40, 20, 40);
            galleryContainer.addView(emptyMsg);
            return;
        }
        
        for (Card card : cards) {
            addCardMediaSection(card);
        }
    }
    
    private void addCardMediaSection(Card card) {
        LinearLayout cardSection = new LinearLayout(this);
        cardSection.setOrientation(LinearLayout.VERTICAL);
        cardSection.setPadding(20, 15, 20, 15);
        cardSection.setBackgroundColor(card.getGender().equals("male") ? 0xFFE6F3FF : 0xFFFFF0F5);
        
        LinearLayout.LayoutParams sectionParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        sectionParams.setMargins(0, 0, 0, 15);
        cardSection.setLayoutParams(sectionParams);
        
        // Card Header
        LinearLayout headerLayout = new LinearLayout(this);
        headerLayout.setOrientation(LinearLayout.HORIZONTAL);
        
        TextView cardName = new TextView(this);
        cardName.setText("📁 " + card.getName() + " (" + card.getCode() + ")");
        cardName.setTextSize(18);
        cardName.setTextColor(0xFF333333);
        cardName.setTypeface(null, android.graphics.Typeface.BOLD);
        
        LinearLayout.LayoutParams nameParams = new LinearLayout.LayoutParams(
            0, LinearLayout.LayoutParams.WRAP_CONTENT, 1.0f
        );
        cardName.setLayoutParams(nameParams);
        headerLayout.addView(cardName);
        
        // Add Media Button for this card
        Button addMediaBtn = new Button(this);
        addMediaBtn.setText("+ Add");
        addMediaBtn.setTextSize(12);
        addMediaBtn.setTextColor(0xFFFFFFFF);
        addMediaBtn.setBackgroundColor(0xFF4CAF50);
        addMediaBtn.setPadding(15, 5, 15, 5);
        addMediaBtn.setOnClickListener(v -> showAddMediaForCard(card));
        headerLayout.addView(addMediaBtn);
        
        cardSection.addView(headerLayout);
        
        // Media Items (Photos/Videos)
        LinearLayout mediaLayout = new LinearLayout(this);
        mediaLayout.setOrientation(LinearLayout.HORIZONTAL);
        mediaLayout.setPadding(0, 10, 0, 0);
        
        // Profile Photo
        if (card.getPhoto() != null && !card.getPhoto().isEmpty()) {
            addMediaItem(mediaLayout, "Profile Photo", "📷", 0xFFADD8E6);
        }
        
        // ID Front
        if (card.getIdFront() != null && !card.getIdFront().isEmpty()) {
            addMediaItem(mediaLayout, "ID Front", "🆔", 0xFFFFB6C1);
        }
        
        // ID Back
        if (card.getIdBack() != null && !card.getIdBack().isEmpty()) {
            addMediaItem(mediaLayout, "ID Back", "🆔", 0xFFFFB6C1);
        }
        
        // Additional media would be loaded from database here
        // For demo, show placeholder
        addMediaItem(mediaLayout, "Sample Video", "🎥", 0xFFDDA0DD);
        addMediaItem(mediaLayout, "Document", "📄", 0xFF98FB98);
        
        cardSection.addView(mediaLayout);
        
        // Empty state if no media
        if (mediaLayout.getChildCount() == 0) {
            TextView noMedia = new TextView(this);
            noMedia.setText("No media files. Tap + Add to upload photos or videos.");
            noMedia.setTextSize(14);
            noMedia.setTextColor(0xFF666666);
            noMedia.setPadding(0, 10, 0, 0);
            cardSection.addView(noMedia);
        }
        
        galleryContainer.addView(cardSection);
    }
    
    private void addMediaItem(LinearLayout container, String name, String icon, int color) {
        LinearLayout mediaItem = new LinearLayout(this);
        mediaItem.setOrientation(LinearLayout.VERTICAL);
        mediaItem.setPadding(15, 10, 15, 10);
        mediaItem.setBackgroundColor(color);
        
        LinearLayout.LayoutParams itemParams = new LinearLayout.LayoutParams(
            120, 100
        );
        itemParams.setMargins(5, 0, 5, 0);
        mediaItem.setLayoutParams(itemParams);
        
        // Icon
        TextView iconView = new TextView(this);
        iconView.setText(icon);
        iconView.setTextSize(24);
        iconView.setGravity(android.view.Gravity.CENTER);
        mediaItem.addView(iconView);
        
        // Name
        TextView nameView = new TextView(this);
        nameView.setText(name);
        nameView.setTextSize(10);
        nameView.setTextColor(0xFF333333);
        nameView.setGravity(android.view.Gravity.CENTER);
        nameView.setMaxLines(2);
        mediaItem.addView(nameView);
        
        // Click listener for viewing media
        mediaItem.setOnClickListener(v -> showMediaViewer(name, icon));
        
        container.addView(mediaItem);
    }
    
    private void showAddMediaDialog() {
        // Get all cards for selection
        List<Card> cards = dbHelper.getAllCards();
        if (cards.isEmpty()) {
            android.widget.Toast.makeText(this, "Create cards first to organize media", android.widget.Toast.LENGTH_SHORT).show();
            return;
        }
        
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Select Card");
        
        String[] cardNames = new String[cards.size()];
        for (int i = 0; i < cards.size(); i++) {
            cardNames[i] = cards.get(i).getName() + " (" + cards.get(i).getCode() + ")";
        }
        
        builder.setItems(cardNames, (dialog, which) -> {
            showAddMediaForCard(cards.get(which));
        });
        
        builder.setNegativeButton("Cancel", null);
        builder.show();
    }
    
    private void showAddMediaForCard(Card card) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Add Media for " + card.getName());
        
        String[] mediaTypes = {"Take Photo", "Select Photo", "Record Video", "Select Video", "Add Document"};
        
        builder.setItems(mediaTypes, (dialog, which) -> {
            String selectedType = mediaTypes[which];
            // In a real app, you'd open camera, gallery, etc.
            android.widget.Toast.makeText(this, "Opening " + selectedType + " for " + card.getName(), android.widget.Toast.LENGTH_SHORT).show();
            
            // Simulate adding media
            loadGallery();
        });
        
        builder.setNegativeButton("Cancel", null);
        builder.show();
    }
    
    private void showMediaViewer(String name, String icon) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(name);
        
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(40, 40, 40, 40);
        layout.setGravity(android.view.Gravity.CENTER);
        layout.setBackgroundColor(0xFF000000);
        
        // Large icon as placeholder
        TextView largeIcon = new TextView(this);
        largeIcon.setText(icon);
        largeIcon.setTextSize(80);
        largeIcon.setGravity(android.view.Gravity.CENTER);
        largeIcon.setTextColor(0xFFFFFFFF);
        layout.addView(largeIcon);
        
        // Media name
        TextView mediaName = new TextView(this);
        mediaName.setText(name);
        mediaName.setTextSize(18);
        mediaName.setTextColor(0xFFFFFFFF);
        mediaName.setGravity(android.view.Gravity.CENTER);
        mediaName.setPadding(0, 20, 0, 0);
        layout.addView(mediaName);
        
        builder.setView(layout);
        builder.setPositiveButton("Close", null);
        builder.setNeutralButton("Delete", (dialog, which) -> {
            android.widget.Toast.makeText(this, name + " deleted", android.widget.Toast.LENGTH_SHORT).show();
            loadGallery();
        });
        
        builder.show();
    }
}