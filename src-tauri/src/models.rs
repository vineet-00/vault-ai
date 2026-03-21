use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Folder {
    pub id: String,
    pub name: String,
    pub parent_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Tag {
    pub id: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Document {
    pub id: String,
    pub title: String,
    pub file_type: String,
    pub folder_id: Option<String>,
    pub path: String,
    pub size: Option<i64>,
    pub page_count: Option<i32>,
    pub embedding_status: String,
    pub summary: Option<String>,
    pub tags: Vec<Tag>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}
