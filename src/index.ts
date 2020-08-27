import mongodbConnect from 'driver/mongodb';
import Server from './server';

async function main(){
  try{
  await Server.init();
  console.log('server running...')
  await mongodbConnect();
  }catch(error){
    console.log('Error on initialize server', error.message)
  }
}

main().then(() => {
}).catch((error) => {console.log(error)});
