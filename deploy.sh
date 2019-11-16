GREEN=`tput setaf 2`
RESET=`tput sgr0`
AWS_KEY=`AKIASZCZ4IQWZFLHWYHC`
AWS_SECRET=`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`
PACKAGE_VERSION=$(grep -m 1 version package.json \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo "${GREEN}DOCKER CONTAINER $PACKAGE_VERSION BUILDING${RESET}"
docker build --tag skydax/skybase .