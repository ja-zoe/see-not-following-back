"use client"
import { ChangeEvent, useState } from "react";

function Home() {
  const [notFollowingBack, setNotFollowingBack] = useState<string[]>([]);

  async function readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result as string));
      reader.addEventListener("error", () => reject(`Failed to read ${file.name} file`));
      reader.readAsText(file);
    });
  }

  async function parseFiles(files: FileList) {
    let followers = []
    let following = []

    console.log("Starting to parse files...");
    for (let i = 0; i < files.length; i++) {
      console.log("Loop ", i, " in progress")
      const content = await readFileContent(files[i])
      if (files[i].name === "followers_1.json") {
        followers = JSON.parse(content)
      } else {
        const parsed = JSON.parse(content)
        following = parsed.relationships_following
      }
    }
    console.log("File parsing complete")
    
    console.log("Creating Followers map")
    const followersMap = new Map()
    for (let i = 0; i < followers.length; i++) {
      followersMap.set(followers[i].string_list_data[0].value, 0)
    }
    console.log("Followers map created")
    console.log(followersMap)

    console.log("Creating newNotFollowingBack")
    const newNotFollowingBack: string[] = []
    for (let i = 0; i < following.length; i++) {
      const username = following[i].string_list_data[0].value
      if (!followersMap.has(username)) {
        newNotFollowingBack.push(username)
      }
    }
    console.log("Finished creating newNotFollowingBack")
    console.log(newNotFollowingBack)
    setNotFollowingBack(newNotFollowingBack)
  }

  function validateFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files || files.length !== 2) {
      alert("You must select exactly two files, Nikki!");
      event.target.value = ""; // Reset the file input
      return;
    }

    if (
      (files[0].name === "followers_1.json" && files[1].name === "following.json") ||
      (files[1].name === "followers_1.json" && files[0].name === "following.json")
    ) {
      parseFiles(files);
    } else {
      alert("Please select the correct files, Nikki. You're getting me tight!");
      event.target.value = ""; // Reset the file input
    }
  }

  return (
    <div className="relative flex flex-col gap-5 items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <p className="text-center">Hello Nickoletta. I made this application for you as requested. 
          Watch the video below to see how to request your following and followers
          list from meta so that you can use this properly. Unfortunately, this was
          the only way it could be done, however, its not that complicated. For
          compensation, I expect barbecue when we return to school.😝</p>
          <video controls width={250}>
            <source src="/the-video.mp4"/>
          </video>
      </div>
      <label className="cursor-pointer text-blue-500 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded">
        Choose Files
        <input type="file" className="hidden" multiple onChange={validateFiles} accept=".json" />
      </label>
      <p className="font-semibold underline">Not Following Back List</p>
      <div className="flex gap-2 flex-wrap justify-center max-h-[600px] overflow-y-auto p-2">
        {notFollowingBack.map((person, index) => {
          return (
            <div key={index} className="px-3 py-1 border-2 transition-opacity border-white rounded-md hover:opacity-50 hover:cursor-pointer">
              <p><a href={`https://www.instagram.com/${person}/`} target="_blank">{person}</a></p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
