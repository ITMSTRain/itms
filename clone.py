import git

repo_url = "https://github.com/KINDEMO1/road-guard.git"
repo_path = "next_ui"

# Clone the repository if it doesn't exist
repo = git.Repo.clone_from(repo_url, repo_path)
print("Repository cloned successfully!")
