# setup the infra for development
# create a venv and install dependencies

python -m venv venv
source venv/bin/activate

cd backend
pip install -r requirements.txt


cd ../frontend
npm install

RED='\033[0;32m'
echo
echo
echo "${RED}project is ready to be used, have fun"
echo
echo