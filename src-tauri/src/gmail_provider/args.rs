pub const DEFAULT_MAX_PAGES: u32 = 1;
pub const DEFAULT_MAX_THREADS: u32 = 25;
pub const MAX_PAGES_CAP: u32 = 10;
pub const MAX_THREADS_CAP: u32 = 500;

pub const ALLOWED_SYNC_JOBS: &[&str] = &["inbox_recent", "unread", "starred", "sent_recent"];

#[derive(Debug, Clone, Default)]
pub struct SyncMetadataOptions {
    pub max_pages: Option<u32>,
    pub max_threads: Option<u32>,
    pub job: Option<String>,
}

#[derive(Debug, Clone, Default)]
pub struct SyncHistoryOptions {
    pub max_pages: Option<u32>,
    pub max_threads: Option<u32>,
    pub job: Option<String>,
}

pub fn validate_sync_job(job: &str) -> Result<(), String> {
    if ALLOWED_SYNC_JOBS.contains(&job) {
        Ok(())
    } else {
        Err(format!(
            "Unknown sync job \"{job}\". Allowed: {}",
            ALLOWED_SYNC_JOBS.join(", ")
        ))
    }
}

fn clamp_pages(value: Option<u32>) -> u32 {
    value
        .unwrap_or(DEFAULT_MAX_PAGES)
        .clamp(1, MAX_PAGES_CAP)
}

fn clamp_threads(value: Option<u32>) -> u32 {
    value
        .unwrap_or(DEFAULT_MAX_THREADS)
        .clamp(1, MAX_THREADS_CAP)
}

pub fn build_sync_metadata_args(options: &SyncMetadataOptions) -> Result<Vec<String>, String> {
    let job = options
        .job
        .as_deref()
        .unwrap_or("inbox_recent")
        .to_string();
    validate_sync_job(&job)?;

    let max_pages = clamp_pages(options.max_pages);
    let max_threads = clamp_threads(options.max_threads);

    Ok(vec![
        "--job".into(),
        job,
        "--max-pages".into(),
        max_pages.to_string(),
        "--max".into(),
        max_threads.to_string(),
    ])
}

pub fn build_sync_history_args(options: &SyncHistoryOptions) -> Result<Vec<String>, String> {
    let job = options
        .job
        .as_deref()
        .unwrap_or("inbox_recent")
        .to_string();
    validate_sync_job(&job)?;

    let max_pages = clamp_pages(options.max_pages);
    let max_threads = clamp_threads(options.max_threads);

    Ok(vec![
        "--job".into(),
        job,
        "--max-pages".into(),
        max_pages.to_string(),
        "--max".into(),
        max_threads.to_string(),
    ])
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sync_metadata_args_are_bounded_and_safe() {
        let args = build_sync_metadata_args(&SyncMetadataOptions {
            max_pages: Some(99),
            max_threads: Some(9999),
            job: Some("inbox_recent".into()),
        })
        .expect("args");
        assert!(args.contains(&"--max-pages".to_string()));
        assert!(args.contains(&"10".to_string()));
        assert!(args.contains(&"500".to_string()));
    }

    #[test]
    fn sync_history_args_default_conservative() {
        let args = build_sync_history_args(&SyncHistoryOptions::default()).expect("args");
        assert_eq!(
            args,
            vec![
                "--job".to_string(),
                "inbox_recent".to_string(),
                "--max-pages".to_string(),
                "1".to_string(),
                "--max".to_string(),
                "25".to_string(),
            ]
        );
    }

    #[test]
    fn unknown_sync_job_rejected() {
        let err = build_sync_metadata_args(&SyncMetadataOptions {
            job: Some("danger".into()),
            ..Default::default()
        })
        .expect_err("job");
        assert!(err.contains("Unknown sync job"));
    }
}
