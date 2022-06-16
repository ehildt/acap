#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# constants
CURRENT_BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
GIT_STATUS_PORCELAIN=$(git status --porcelain | head -1)
REGEX_GIT_BRANCH_NAME="^(feat|fix|chore|bug|task|wiki)\/[0-9]{4,}-[a-zA-Z0-9_\.\-]+$"
REGEX_GIT_COMMIT_MSG="^(feat|fix|chore|task|docs|test|style|ref|perf|build|ci|revert|wip)(\(.+?\))?: .{1,}$"
REGEX_GIT_MSG_LENGTH="^.{1,88}$"

# formators
magentafy() { echo "\e[1m\e[35m$*\e[0m"; }
cyanfy() { echo "\e[1m\e[36m$*\e[0m"; }
greenfy() { echo "\e[1m\e[32m$*\e[0m"; }
redfy() { echo "\e[1m\e[31m$*\e[0m"; }
yellowfy() { echo "\e[1m\e[33m$*\e[0m"; }
bluefy() { echo "\e[1m\e[34m$*\e[0m"; }
bolderfy() { echo "\e[1m$*\e[0m"; }
info() { echo "$(bolderfy \[)$(greenfy 'husky')$(bolderfy '@')$(magentafy $(echo $0 | cut -c 8-))$(bolderfy \])$(bolderfy ':') $(cyanfy $*)"; }
debug() { echo "$(bolderfy \[)$(greenfy 'husky')$(bolderfy '@')$(yellowfy debug)$(bolderfy \])$(bolderfy ':') $(bluefy $*)"; }

# all files must be stagged and commited!
check_working_directory() {
    if [ -n "$GIT_STATUS_PORCELAIN" ]; then
        info "check_working_directory.. $(redfy error)"
        debug "no uncommitted changes!"
        exit 1
    else
        info "check_working_directory.. $(yellowfy ok)"
    fi
}

# branch identifier must pass REGEX_GIT_BRANCH_NAME
check_branch_identifier() {
    if [ -z "$(echo $CURRENT_BRANCH_NAME | grep -E $REGEX_GIT_BRANCH_NAME 2>/dev/null)" ]; then
        info "check_branch_identifier.. $(redfy error)"
        debug "not permitted working on top of branch $(yellowfy $CURRENT_BRANCH_NAME)!"
        exit 1
    else
        info "check_branch_identifier.. $(yellowfy ok)"
    fi
}

# commit message must pass REGEX_GIT_COMMIT_MSG
check_commit_msg_format() {
    if ! head -1 "$1" | grep -qE "$REGEX_GIT_COMMIT_MSG"; then
        info "check_commit_msg_format.. $(redfy error)"
        debug "commit message must follow the conventional style!"
        exit 1
    else
        info "check_commit_msg_format.. $(yellowfy ok)"
    fi
}

# commit message length must pass REGEX_GIT_MSG_LENGTH
check_commit_msg_length() {
    if ! head -1 "$1" | grep -qE "$REGEX_GIT_MSG_LENGTH"; then
        local COMMIT_MSG_LENGTH=$(head -1 "$1" | wc -m)
        info "check_commit_msg_length.. $(redfy error)"
        debug "commit message length exceeded $(bolderfy \[)$(redfy $COMMIT_MSG_LENGTH)/88$(bolderfy \])"
        exit 1
    else
        info "check_commit_msg_length.. $(yellowfy ok)"
    fi
}

# commit changes post npm install
post_merge_install() {
    info 'npm install | 2>/dev/null' && npm install | 2>/dev/null
    if [ -n '$(git commit -am "chore(husky): ncu" -n | grep -o "nothing to commit")' ]; then
        info "post-npm-install => working tree clean, nothing to commit!"
    else
        info "post-npm-install => package.json, package-lock.json committed!"
    fi
}

# check if package-lock-json changed
check_package_dependencies() {
    if [ -n "$(git diff HEAD^ HEAD --exit-code -- ./package-lock.json | head -1)" ]; then
        info "package-lock.json changed."
        post_merge_install
    fi
}

# check licenses
check_licenses() {
    if [ $(npx licensee --errors-only | wc -m) -eq 0 ]; then
        info "check_licenses.. $(yellowfy ok)"
    else
        info "check_licenses.. $(redfy error)"
        debug "resolve licenses (.lecensee.json)"
        exit 1
    fi
}

gitleaks_detect() {
    GITLEAKS_LEAKS=$(docker run --rm -v $(cd .. && pwd):/app zricethezav/gitleaks -c /app/config-manager/gitleaks.toml detect -v --source="/app/config-manager/" --no-git 2>/dev/null)
    if [ "$?" -eq 1 ]; then
        info "gitleaks.. $(redfy error)"
        debug "see gitleaks.json to resolve credentials or whitelist in gitleaks.toml"
        exit 1
    else
        info "gitleaks.. $(yellowfy ok)"
    fi
}

# lint staged filess
check_lint_staged() {
    if [ -n '$(npx lint-staged --allow-empty | tail -1 | grep -E "No staged files|[SUCCESS]"' ]; then
        info "check_lint_staged.. $(yellowfy ok)"
    else
        info "check_lint_staged.. $(redfy error)"
        debug "npm run lint-staged"
        exit 1
    fi
}
