package com.minhaloja.app;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.graphics.Color;
import android.graphics.Typeface;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {

    private WebView webView;
    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setFlags(
                android.view.WindowManager.LayoutParams.FLAG_SECURE,
                android.view.WindowManager.LayoutParams.FLAG_SECURE
        );

        prefs = getSharedPreferences("MinhaLojaConta", MODE_PRIVATE);

        if (prefs.getBoolean("cadastrado", false)) {
            abrirLoja();
        } else {
            mostrarCadastro();
        }
    }

    private void mostrarCadastro() {

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(40, 60, 40, 40);
        layout.setGravity(Gravity.CENTER_HORIZONTAL);

        TextView titulo = new TextView(this);
        titulo.setText("🎨 Minha Loja de Arte");
        titulo.setTextSize(28);
        titulo.setTypeface(null, Typeface.BOLD);
        titulo.setGravity(Gravity.CENTER);
        titulo.setTextColor(Color.BLACK);

        TextView subtitulo = new TextView(this);
        subtitulo.setText("Crie a sua conta para continuar");
        subtitulo.setTextSize(18);
        subtitulo.setGravity(Gravity.CENTER);
        subtitulo.setPadding(0, 20, 0, 30);

        EditText nome = new EditText(this);
        nome.setHint("Nome completo");

        EditText telefone = new EditText(this);
        telefone.setHint("Número de telefone");
        telefone.setInputType(2);

        EditText email = new EditText(this);
        email.setHint("Email");
        email.setInputType(33);

        EditText senha = new EditText(this);
        senha.setHint("Criar senha");
        senha.setInputType(129);

        Button cadastrar = new Button(this);
        cadastrar.setText("CRIAR CONTA");

        TextView mensagem = new TextView(this);
        mensagem.setText("");
        mensagem.setTextSize(15);
        mensagem.setGravity(Gravity.CENTER);
        mensagem.setPadding(0, 20, 0, 0);

        layout.addView(titulo);
        layout.addView(subtitulo);
        layout.addView(nome);
        layout.addView(telefone);
        layout.addView(email);
        layout.addView(senha);
        layout.addView(cadastrar);
        layout.addView(mensagem);

        setContentView(layout);

        cadastrar.setOnClickListener(v -> {

            String n = nome.getText().toString().trim();
            String t = telefone.getText().toString().trim();
            String e = email.getText().toString().trim();
            String s = senha.getText().toString();

            if (n.isEmpty() || t.isEmpty() || e.isEmpty() || s.isEmpty()) {
                mensagem.setText("Preencha todos os campos.");
                return;
            }

            if (s.length() < 6) {
                mensagem.setText("A senha deve ter pelo menos 6 caracteres.");
                return;
            }

            prefs.edit()
                    .putBoolean("cadastrado", true)
                    .putString("nome", n)
                    .putString("telefone", t)
                    .putString("email", e)
                    .putString("senha", s)
                    .apply();

            abrirLoja();
        });
    }

    private void abrirLoja() {

        webView = new WebView(this);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);

        webView.setWebViewClient(new WebViewClient() {

            @Override
            public boolean shouldOverrideUrlLoading(
                    WebView view,
                    android.webkit.WebResourceRequest request
            ) {
                return abrirLink(request.getUrl().toString());
            }

            @Override
            public boolean shouldOverrideUrlLoading(
                    WebView view,
                    String url
            ) {
                return abrirLink(url);
            }
        });

        webView.loadUrl("https://eosyckadyboy-collab.github.io/Minha-loja/");

        setContentView(webView);
    }

    private boolean abrirLink(String url) {

        if (url.startsWith("http://") || url.startsWith("https://")) {
            return false;
        }

        try {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(url));
            startActivity(intent);
            return true;
        } catch (Exception e) {
            return true;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
