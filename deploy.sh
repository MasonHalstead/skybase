GREEN=`tput setaf 2`
RESET=`tput sgr0`
PACKAGE_VERSION=$(grep -m 1 version package.json \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo "${GREEN}DOCKER LOGIN${RESET}"
docker login -u='skydax' -p='Krowdspace88!'
echo "${GREEN}DOCKER CONTAINER $PACKAGE_VERSION BUILDING${RESET}"
docker build --tag skydax/skybase:$PACKAGE_VERSION .
echo "${GREEN}DOCKER CONTAINER $PACKAGE_VERSION PUSH${RESET}"
docker push skydax/skybase:$PACKAGE_VERSION
echo "${GREEN}DOCKER LOGOUT${RESET}"
docker logout