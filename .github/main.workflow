workflow "Deploy workflow" {
  on = "push"
  resolves = ["Deploy"]
}

action "Install" {
  uses = "docker://node:alpine"
  runs = "yarn"
  args = "install"
}

action "Lint" {
  uses = "docker://node:alpine"
  needs = ["Install"]
  runs = "yarn"
  args = "lint"
}

action "Build" {
  uses = "docker://node:alpine"
  needs = ["Lint"]
  runs = "yarn"
  args = "build"
}

action "Ensure publish branch" {
  needs = "Build"
  uses = "actions/bin/filter@46ffca7632504e61db2d4cb16be1e80f333cb859"
  args = "branch publish"
}

action "Deploy" {
  uses = "haishanh/actions/gh-pages@master"
  needs = ["Ensure publish branch"]
  secrets = ["TOKEN"]
}
