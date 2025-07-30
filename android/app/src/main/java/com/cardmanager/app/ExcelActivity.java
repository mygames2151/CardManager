package com.cardmanager.app;

import android.app.AlertDialog;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.util.List;

public class ExcelActivity extends AppCompatActivity {
    
    private DatabaseHelper dbHelper;
    private LinearLayout filesContainer;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        dbHelper = new DatabaseHelper(this);
        setupExcelLayout();
        loadExcelFiles();
    }
    
    private void setupExcelLayout() {
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
        title.setText("Excel Editor");
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
        
        // Create New File Button
        Button createBtn = new Button(this);
        createBtn.setText("+ Create New Spreadsheet");
        createBtn.setTextSize(16);
        createBtn.setTextColor(0xFFFFFFFF);
        createBtn.setBackgroundColor(0xFFFFB6C1);
        createBtn.setPadding(20, 15, 20, 15);
        createBtn.setOnClickListener(v -> showCreateFileDialog());
        
        LinearLayout.LayoutParams createBtnParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        createBtnParams.setMargins(0, 0, 0, 20);
        createBtn.setLayoutParams(createBtnParams);
        mainLayout.addView(createBtn);
        
        // Files Container (Scrollable)
        ScrollView scrollView = new ScrollView(this);
        filesContainer = new LinearLayout(this);
        filesContainer.setOrientation(LinearLayout.VERTICAL);
        scrollView.addView(filesContainer);
        
        LinearLayout.LayoutParams scrollParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, 0, 1.0f
        );
        scrollView.setLayoutParams(scrollParams);
        mainLayout.addView(scrollView);
        
        setContentView(mainLayout);
    }
    
    private void loadExcelFiles() {
        filesContainer.removeAllViews();
        List<ExcelFile> files = dbHelper.getAllExcelFiles();
        
        if (files.isEmpty()) {
            TextView emptyMsg = new TextView(this);
            emptyMsg.setText("No spreadsheets found. Create your first one!");
            emptyMsg.setTextSize(16);
            emptyMsg.setTextColor(0xFF666666);
            emptyMsg.setGravity(android.view.Gravity.CENTER);
            emptyMsg.setPadding(20, 40, 20, 40);
            filesContainer.addView(emptyMsg);
            return;
        }
        
        for (ExcelFile file : files) {
            addFileView(file);
        }
    }
    
    private void addFileView(ExcelFile file) {
        LinearLayout fileLayout = new LinearLayout(this);
        fileLayout.setOrientation(LinearLayout.VERTICAL);
        fileLayout.setPadding(20, 15, 20, 15);
        fileLayout.setBackgroundColor(0xFFF0F8FF);
        
        LinearLayout.LayoutParams fileParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        fileParams.setMargins(0, 0, 0, 10);
        fileLayout.setLayoutParams(fileParams);
        
        // File Header
        LinearLayout headerLayout = new LinearLayout(this);
        headerLayout.setOrientation(LinearLayout.HORIZONTAL);
        
        TextView nameText = new TextView(this);
        nameText.setText("📊 " + file.getName());
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
        editBtn.setOnClickListener(v -> showSpreadsheetEditor(file));
        headerLayout.addView(editBtn);
        
        fileLayout.addView(headerLayout);
        
        // File Date
        TextView dateText = new TextView(this);
        dateText.setText("Created: " + new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm", java.util.Locale.getDefault()).format(new java.util.Date(file.getCreatedDate())));
        dateText.setTextSize(12);
        dateText.setTextColor(0xFF666666);
        dateText.setPadding(0, 5, 0, 0);
        fileLayout.addView(dateText);
        
        filesContainer.addView(fileLayout);
    }
    
    private void showCreateFileDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Create New Spreadsheet");
        
        EditText nameInput = new EditText(this);
        nameInput.setHint("Spreadsheet Name");
        nameInput.setPadding(20, 20, 20, 20);
        builder.setView(nameInput);
        
        builder.setPositiveButton("Create", (dialog, which) -> {
            String name = nameInput.getText().toString().trim();
            if (name.isEmpty()) {
                android.widget.Toast.makeText(this, "Name is required", android.widget.Toast.LENGTH_SHORT).show();
                return;
            }
            
            // Create empty spreadsheet data (5x10 grid)
            StringBuilder data = new StringBuilder();
            for (int row = 0; row < 10; row++) {
                for (int col = 0; col < 5; col++) {
                    data.append("");
                    if (col < 4) data.append(",");
                }
                if (row < 9) data.append("\n");
            }
            
            long id = dbHelper.addExcelFile(name, data.toString());
            loadExcelFiles();
        });
        
        builder.setNegativeButton("Cancel", null);
        builder.show();
    }
    
    private void showSpreadsheetEditor(ExcelFile file) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Edit: " + file.getName());
        
        ScrollView scrollView = new ScrollView(this);
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(20, 20, 20, 20);
        
        // Simple text area for spreadsheet data
        EditText dataInput = new EditText(this);
        dataInput.setText(file.getData());
        dataInput.setHint("Enter spreadsheet data (comma-separated values, one row per line)");
        dataInput.setLines(15);
        dataInput.setHorizontallyScrolling(true);
        dataInput.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE);
        layout.addView(dataInput);
        
        // Instructions
        TextView instructions = new TextView(this);
        instructions.setText("Format: value1,value2,value3\\nNext row: value4,value5,value6");
        instructions.setTextSize(12);
        instructions.setTextColor(0xFF666666);
        instructions.setPadding(0, 10, 0, 0);
        layout.addView(instructions);
        
        scrollView.addView(layout);
        builder.setView(scrollView);
        
        builder.setPositiveButton("Save", (dialog, which) -> {
            file.setData(dataInput.getText().toString());
            // In a real app, you'd call dbHelper.updateExcelFile(file)
            android.widget.Toast.makeText(this, "Spreadsheet saved", android.widget.Toast.LENGTH_SHORT).show();
        });
        
        builder.setNeutralButton("Preview", (dialog, which) -> {
            showSpreadsheetPreview(file.getName(), dataInput.getText().toString());
        });
        
        builder.setNegativeButton("Cancel", null);
        builder.show();
    }
    
    private void showSpreadsheetPreview(String name, String data) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Preview: " + name);
        
        ScrollView scrollView = new ScrollView(this);
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(20, 20, 20, 20);
        
        String[] rows = data.split("\n");
        for (String row : rows) {
            LinearLayout rowLayout = new LinearLayout(this);
            rowLayout.setOrientation(LinearLayout.HORIZONTAL);
            
            String[] cells = row.split(",");
            for (String cell : cells) {
                TextView cellView = new TextView(this);
                cellView.setText(cell.trim());
                cellView.setPadding(10, 10, 10, 10);
                cellView.setBackgroundColor(0xFFF0F0F0);
                cellView.setMinWidth(120);
                
                LinearLayout.LayoutParams cellParams = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT
                );
                cellParams.setMargins(2, 2, 2, 2);
                cellView.setLayoutParams(cellParams);
                
                rowLayout.addView(cellView);
            }
            
            layout.addView(rowLayout);
        }
        
        scrollView.addView(layout);
        builder.setView(scrollView);
        builder.setPositiveButton("Close", null);
        builder.show();
    }
}