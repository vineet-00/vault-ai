use fastembed::{EmbeddingModel, InitOptions, TextEmbedding};
use std::sync::{Mutex, OnceLock};

static EMBEDDING_MODEL: OnceLock<Mutex<TextEmbedding>> = OnceLock::new();

pub fn get_model() -> Result<std::sync::MutexGuard<'static, TextEmbedding>, String> {
    let model = EMBEDDING_MODEL.get_or_init(|| {
        let m = TextEmbedding::try_new(
            InitOptions::new(EmbeddingModel::AllMiniLML6V2)
                .with_show_download_progress(true),
        )
        .expect("Failed to load embedding model");
        Mutex::new(m)
    });
    model.lock().map_err(|e| e.to_string())
}

pub fn embed_text(text: &str) -> Result<Vec<f32>, String> {
    let model = get_model()?;
    let embeddings = model
        .embed(vec![text], None)
        .map_err(|e| e.to_string())?;
    Ok(embeddings.into_iter().next().unwrap_or_default())
}

pub fn embed_batch(texts: Vec<&str>) -> Result<Vec<Vec<f32>>, String> {
    let model = get_model()?;
    model.embed(texts, None).map_err(|e| e.to_string())
}
