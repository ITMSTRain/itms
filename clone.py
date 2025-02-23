import git

repo_url = "https://github.com/KINDEMO1/Improved-Road-Guard-Frontend.git"
repo_path = "frontend"

# Clone the repository if it doesn't exist
repo = git.Repo.clone_from(repo_url, repo_path)
print("Repository cloned successfully!")
