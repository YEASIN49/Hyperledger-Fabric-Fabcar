
# Hyperledger Fabric Part - 2

From the last lab, we created our dev environment and used test network and interact with an application called fabcar. Today we will extend our knowledge by understanding the inner mechanism of fabcar and finally we will see how we can integrate frontend with our fabcar application. Finally we will use it from our browser.


## Let's rewind ( Prerequisites )


Before getting started, some of you may still have problems regarding the installation and setup of the environment. So we will rewind section 1 of last lab. If you already have docker installed and Hyperledger fabric fabric-samples, you can skip this step.

1.  Assuming you already have git installed in your computer. Check for the git version using the command provided below. If you do not get any version in the log you need to install git( *You can follow last lab for this step* )
```
git --version 
```
2. Now, we will install Docker and Docker Compose. But first, remove the older versions of Docker (if any) using the following commands:
```
sudo apt-get remove docker docker-engine docker.io containerd runc
```
It is okay if the above command reports that none of these packages is installed or package 'xyz..' is not installed.

3. Now, Update apt:
```
sudo apt-get update
```
4. Install packages to allow apt to use a repository over HTTPS:
```
sudo apt-get update && sudo apt-get install apt-transport-https ca-certificates gnupg-agent software-properties-common lsb-release -y
```
This may take some time to install,

5. The command below is for downloading the Docker’s official GPG key.  where **-o** defines the output path and **--dearmor** is to help convert the file into gpg format.
```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-keyring.gpg
```
Don't worry if this command does not show you any response or logs in terminal. Here, **docker-keyring.gpg** is the file containing the key.

6. Use the following command to set up the stable repository and adding it to the list of package source: 
```
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
This command will also don't show any response or logs in terminal.

7. Now, update the apt package again:
```
sudo apt-get update
```
This will show logs like below:
![App Screenshot](./_readme-image/1_update_apt.png)

NOTE: If you a GPG error when running apt-get update run the following command: 
```shell
sudo chmod a+r /etc/apt/keyrings/docker.gpg
sudo apt-get update
```


8. Install docker :
```
sudo apt-get install docker-ce docker-ce-cli containerd.io -y
```

9. Now, to test the docker installation run: 
```
docker run hello-world
```
Don’t worry by seeing the message **“Unable to find image 'hello-world:latest' locally”**. This command initially checks if the hello-world image exists locally or not. If not found, it will be fetched from the library. 
After successfully installation you should see a message like below:
![App Screenshot](./_readme-image/2_hello_docker.png)

10. If you cannot run the above command and it shows the permission denied message, then you might need to use the following commands to ensure that the user can run the docker commands without being sudo. However, if the **step 9** worked, you can skip this step 10.
- Add docker to user group
```
sudo groupadd docker
```  
This might report that the docker group is already added, Which is totally fine

- Now, add the current user to the docker group using:
```
sudo usermod -a -G docker $USER
```
- Finally, activate the change by:
```
newgrp docker
```

- Now, again test the docker installation from **step 9**. If step 9 fails again, Then issue the command:
```
sudo reboot
```
This will restart your machine and then again open the terminal and follow **step 9**. it should work now.

11. Download the docker-compose binary file using the command mentioned below. You can  see the version that we are using is 1.29.2. If you use an older version, you may get errors in upcoming steps. Therefore you should maintain the version according to the instruction of this lab:
```
sudo curl -L https://github.com/docker/compose/releases/download/1.29.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
```
Depending on your internet, this may take time. When it is finished, you should see a response like below:
![App Screenshot](./_readme-image/3_download_composer.png)

12. Make it executable using: 
```
sudo chmod +x /usr/local/bin/docker-compose
```
Dont' worry, if this command does not show any response or logs in terminal.

13. Now, check the installation: 
```
docker-compose --version
```
You should see a version like **"docker-compose version 1.29.2, build 5becea4c"**

14. Now, test the installation using the following steps:
```
mkdir hello-world
cd hello-world
nano docker-compose.yml

```
15. Now, add the following contents to the editor. After adding the following contents, press ctrl + o and then press enter to save the content. press ctrl + x to exit.  It is important to maintain indentation:
```yml
my-test:
    image: hello-world
```
16. Now run the command: 
```
docker-compose up
```
The first time we run the command, if there's no local image named hello-world, Docker Compose will pull it from the Docker Hub public repository. Then it prints a similar message like below, which indicates our docker-compose installation is complete.
![App Screenshot](./_readme-image/4_compose_up.png)

17. Now, our computer is ready to install Hyperledger Fabric. But, the first step is to remove existing Fabric images, if any:
```
docker container prune
```

18. Next, copy and run the exact same command( don't remove space to make it one line sentence ).
```
cd ../
mkdir fabric
cd fabric
```
If fabric file already exist, delete and run the command again. 

19. Now, by issuing the following command we will install fabric version 2.2.2 and ca version 1.4.9
```
sudo curl -sSL http://bit.ly/2ysbOFE | bash -s -- 2.2.2 1.4.9
```
This process will take time depending on your internet speed. Once it ends, you will see responses like below. There are different versions of Fabric available. However, the 2.2 is the LTS one. It might take some time. This will create a folder called **“fabric-sample”**. Check it, you should see a lot of files inside it. These are some sample boilerplates. we only need some of them. You will learn it later in this lab. 
![App Screenshot](./_readme-image/5_install_sample_fabric.png)

🤔🤔🤔 If you face difficulties to run the command, try the alternative command provided below:

```
sudo curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh | bash -s -- 2.2.2 1.4.9
```

20. Now, if you check **fabric-samples** directory, you will see a lot of files there. However,  for today's lab we only need some of them mentioned in the image below:
![App Screenshot](./_readme-image/6_required_file_list.png)

These are the files and directories we should have.

- **Checkpoint 1: Show this to your teacher.**
    -



## Section 1: Setting up files and folders
In this section, we will see how we can communicate with the chaincode from the browser.

1. First, download the files from https://github.com/YEASIN49/Hyperledger-Fabric-Fabcar and unzip the contents. If you want you also can clone it. To clone it open terminal and issue:
```
git clone https://github.com/YEASIN49/Hyperledger-Fabric-Fabcar.git
```
This will successfully clone the github repository and now you should have a directory called **Hyperledger-Fabric-Fabcar** to your **Home** directory. 
![App Screenshot](./_readme-image/7_cloned_repo.png)

2. Now, go to the **Hyperledger-Fabric-Fabcar** directory and copy **fabric-client** and **javascript** folder.
![App Screenshot](./_readme-image/8_copy_file.png)

3. Now, go to the **fabric/fabric-samples/fabcar** directory and paste the copied files.
![App Screenshot](./_readme-image/9_paste_file.png)
Here, we are developing our application using javascript. So, you can delete **go, java and typescript** directory from here if you want. Just make sure we have **fabric-client, javascript, networkDown.sh and startFabric.sh** inside **fabcar**

4. Now, open vscode or any other text editor you use and open **fabric-samples** there.
![App Screenshot](./_readme-image/10_open_editor.png)

You should have a similar window with these file in your text editor.
You are now good to go to the next section.

- **Checkpoint 2: Show this to your teacher**

## Section 2: Running the complete application
In this section, you will run the complete application added with User Interface to interact from the browser. You need to follow the steps to run it. Don't worry if you don't understand anything while running the application. Once you successfully run it, your teacher will explain the code for you. 

1. Open terminal from your code editor. You current path should be in **fabric/fabric-samples** like mentioned in the image below:
![App Screenshot](./_readme-image/11_editor_path.png)

2. Go to the javascript directory inside fabcar using:
```
cd fabcar/javascript
```
3. Now, we need to install npm packages. You can find the necessary packages that we are going to install inside the package.json file. To install run:
```
npm i
``` 
If you cannot run the command for the permission, just add keyword "sudo" at the beginning of the command. This may take time to install packages depending on your internet connection. After, successful installation, you should see some logs similar to image below:
![App Screenshot](./_readme-image/12_package_installation.png)

4. In the upcoming step, we will start the network and deploy chaincode. But we need to shut down if currently any network is running. To shut down first go to the  **fabcar** directory from the vscode terminal by:
```
cd ../
```
5. If you check the files of current directory by using the command ```ls``` you should see something like below:

![App Screenshot](./_readme-image/13_current_path_fabcar.png)

6. run the command to shut down the network:
```
./networkDown.sh
```
This should, stop existing running hyperledger fabric test-network. Again, if you cannot run the command for access permission restriction, simply add keyword 'sudo' at the beginning of the command. After successfully shutting down the network you should see response like below:
![App Screenshot](./_readme-image/14_network_stop.png)

7. Now, start the network:
```
./startFabric.sh javascript
```
Again, for permission restriction, use 'sudo'. This command, start and also deploy the chaincode. So, this will take time to complete. Once it is completed, you should see a large logs printed in your vscode terminal which ends with similar response like mentioned in the image below:
![App Screenshot](./_readme-image/15_start_network.png)

8. Now, we will power up our backend service. To do this, first go  to the **javascript** directory in fabcar.
```
cd javascript
```
9. run the command below to enroll admin to organization:
```
node enrollAdmin.js
```
You will get a similar response like below:
![App Screenshot](./_readme-image/16.1_enrollAdmin.png)

and then run the command to register user to organization:
```
node registerUser.js
```

This will create a user under organization. You will see a response like below:
![App Screenshot](./_readme-image/16.2-_register_user.png)

Finally, we will power up our backend using:  

```
npm start
```
This will, start the backend service and you should see a response like below:
![App Screenshot](./_readme-image/16_start_backend.png)

9. Now, leave the terminal untouched and open a new terminal from the vscode and go to the **fabcar-client** directory.
```
cd fabcar/fabcar-client/
```
10. Now, go to the, extension tab of vscode and search 'live server'. You will find a lot of options. Install the extension shown in the image:
![App Screenshot](./_readme-image/17_install_live_server.png)

11. Now, click the **index.html** file and start **live-server** from the  bottom-right of the vscode.
![App Screenshot](./_readme-image/18_start_UI.png)

This will start our frontend server and a browser popup will open like image below:
![App Screenshot](./_readme-image/19_UI.png)

Now, use and try to understand the features. You can check the currently running docker container using:
```shell
docker ps
```
You should see the status of the containers are up.In addition to  the  peers of org1, org2 and orderer now we also have ca_org1 and ca_rg2, ca_orderer and most importantly the couchDb;3.1.1 with port 5984. This is the database, where  our state data is stored.  go to  this link: http://localhost:5984/_utils/#login and you will see a login option to couchDB has appeared. default credential to access it is, ```username: admin```, ```password: adminpw```. once you are logged in, you will see a UI like below where **mychannel_fabcar** is the database we are currently using. Explore it you should see these are the same data created by initLedger function  of our chaincode.
![App Screenshot](./_readme-image/database.png)


**Checkpoint 3: Show till this part to your teacher**

The diagram provided below shows how the backend, frontend and chaincode maintain their communication. Here, the respective file/folder names are also included  for easier understanding. Here fabric-client  is the frontend part, javascript folder contains the backend related services and fabric.js is the chaincode which is located in chaincode/fabcar/javascript/lib directory.

![App Screenshot](./_readme-image/20_fabric_application_diagram.png)