import { Component, OnInit } from '@angular/core';
import { FirestoreDatabaseService } from 'src/app/shared/services/firebase/firestoreDatabase/firestore-database.service';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { videoGenres } from '../../../mainConfigFile';
import { MaterialLoaderServeService } from 'src/app/common-custom-modules/material-loader/material-loader.module';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  addVideoForm: FormGroup;
  uid: string;
  userData: any;
  isEpisodePresent: boolean;
  episodeArray: any[] = [];
  editEpisodeArray: any[] = [];
  routeSubscription: any;
  forAddingNewVideo: boolean;
  videoIDForEditing: string;
  videoDataForEditing: any;
  videoGenreList: any;
  videoEpisodeArrayLength: number;

  constructor(
    private firestoreDB: FirestoreDatabaseService,
    private formBuilder: FormBuilder,
    private storage: StorageService,
    private toasterAlert: ToastrService,
    private route: ActivatedRoute,
    private materialLoader: MaterialLoaderServeService
  ) {
    this.videoGenreList = videoGenres;
    this.addVideoForm = this.formBuilder.group({
      videoName: new FormControl('', [Validators.required]),
      videoDescription: new FormControl('', [Validators.required]),
      videoThumbnailURL: new FormControl('', [Validators.required]),
      videoVideoURL: new FormControl('', [Validators.required]),
      videoGenre: new FormControl('', [Validators.required]),
      videoEpisodeArray: this.formBuilder.array([])
    });
    this.isEpisodePresent = false;
  }

  ngOnInit() {
    this.routeSubscription = this.route
      .queryParams
      .subscribe(params => {
        this.forAddingNewVideo = JSON.parse(params['newVideo']);
        if (!this.forAddingNewVideo) {
          console.log('For editing');
          this.videoIDForEditing = params['videoID'];
          console.log('Video id---> ', this.videoIDForEditing);
          this.firestoreDB.getVideoPlaylist(this.videoIDForEditing).then((result: any) => {

            this.materialLoader.getStatus().subscribe((loaderStatus: any) => {
              setTimeout(() => {
                if (loaderStatus.show === true) {
                  this.materialLoader.hide();
                }
              }, 500);
            });
            if (!result.error) {
              this.videoDataForEditing = result.response;
              console.log('Video for editing---> ', this.videoDataForEditing);
              this.putDataInForm(this.videoDataForEditing);
            }
          }).catch(error => {
            console.log('Error--> ', error);
          });
        }
        // this.getPlaylist(this.videoID);
      });
    this.uid = this.storage.getUID();
    this.firestoreDB.getUserData(this.uid).then((result: any) => {
      if (!result.error) {
        this.userData = result.response;
      }
    }).catch((error) => {
      console.log('error--> ', error);
    });
    if (!this.forAddingNewVideo) {

    }
  }

  putDataInForm(data) {
    this.addVideoForm.controls.videoName.patchValue(data.name);
    this.addVideoForm.controls.videoDescription.patchValue(data.description);
    this.addVideoForm.controls.videoThumbnailURL.patchValue(data.URL.thumbnail);
    this.addVideoForm.controls.videoVideoURL.patchValue(data.URL.video);
    this.addVideoForm.controls.videoGenre.patchValue(data.genre);
    if (data.episode.length > 0) {
      this.isEpisodePresent = true;
      data.episode.forEach((element, i) => {
        // this.addNewInputField();
        // this.addVideoForm.controls.videoEpisodeArray[i].patchValue(data.episode[i]);
        // const val = this.addVideoForm.controls.videoEpisodeArray;
        // console.log('Value--> ', val);
        const control = <FormArray>this.addVideoForm.controls['videoEpisodeArray'];
        control.push(this.formBuilder.group({
          episodeName: element.name,
          episodeDescription: element.description,
          episodeThumbnailURL: element.URL.thumbnail,
          episodeVideoURL: element.URL.video
        }));
      });
      const videoArray = <FormArray>this.addVideoForm.controls['videoEpisodeArray'];
      this.videoEpisodeArrayLength = videoArray.controls.length;
    }
  }

  addNewInputField(): void {
    console.log('ss ', this.addVideoForm);
    const control = <FormArray>this.addVideoForm.controls['videoEpisodeArray'];
    this.videoEpisodeArrayLength = control.controls.length;
    control.push(this.initDynamicFields());
  }

  removeInputField(i: number): void {
    const control = <FormArray>this.addVideoForm.controls['videoEpisodeArray'];
    control.removeAt(i);
  }

  initDynamicFields(): FormGroup {
    return this.formBuilder.group({
      episodeName: [''],
      episodeDescription: [''],
      episodeThumbnailURL: [''],
      episodeVideoURL: ['']
    });
  }

  addMainVideo(videoID, episodeArray, isEpisodePresent, forEditing) {
    console.log('this.videoDataForEditing---> ', this.videoDataForEditing);
    if (forEditing) {
      if (this.videoDataForEditing.URL.video === this.addVideoForm.value.videoVideoURL) {
        const mainVideoObject = {
          videoID: videoID,
          name: this.addVideoForm.value.videoName,
          description: this.addVideoForm.value.videoDescription,
          URL: {
            thumbnail: this.addVideoForm.value.videoThumbnailURL,
            video: this.addVideoForm.value.videoVideoURL
          },
          addedBy: this.videoDataForEditing.addedBy,
          addedOn: this.videoDataForEditing.addedOn,
          episode: isEpisodePresent ? episodeArray : [],
          genre: this.addVideoForm.value.videoGenre,
          isActive: true,
          isSeries: isEpisodePresent,
          likes: this.videoDataForEditing.likes,
          sortOrder: 0,
          views: this.videoDataForEditing.views
        };
        console.log('Video aftr editing---> ', mainVideoObject);
        this.firestoreDB.createNewVideoPlaylist(mainVideoObject)
          .then((result: any) => {
            if (!result.error) {
              if (!forEditing) {
                this.toasterAlert.success('New Video Added!');
              } else {
                this.toasterAlert.success('Video Updated Successfully!');
              }
            }
          }).catch((error: any) => {
            this.toasterAlert.error(error.errorDetails);
          });
      } else {
        const mainVideoData = {
          videoID: videoID,
          name: this.addVideoForm.value.videoName,
          description: this.addVideoForm.value.videoDescription,
          URL: {
            thumbnail: this.addVideoForm.value.videoThumbnailURL,
            video: this.addVideoForm.value.videoVideoURL
          },
          addedBy: {
            name: this.userData.profile.name,
            uid: this.uid
          },
          addedOn: Date.now(),
          episode: isEpisodePresent ? episodeArray : [],
          genre: this.addVideoForm.value.videoGenre,
          isActive: true,
          isSeries: isEpisodePresent,
          likes: {
            likes: 0,
            likedBy: []
          },
          sortOrder: 0,
          views: 0
        };
        console.log('Video aftr editing---> ', mainVideoData);
        this.firestoreDB.createNewVideoPlaylist(mainVideoData)
          .then((result: any) => {
            if (!result.error) {
              if (!forEditing) {
                this.toasterAlert.success('New Video Added!');
              } else {
                this.toasterAlert.success('Video Updated Successfully!');
              }
            }
          }).catch((error: any) => {
            this.toasterAlert.error(error.errorDetails);
          });
      }
    } else {
      const mainVideoData = {
        videoID: videoID,
        name: this.addVideoForm.value.videoName,
        description: this.addVideoForm.value.videoDescription,
        URL: {
          thumbnail: this.addVideoForm.value.videoThumbnailURL,
          video: this.addVideoForm.value.videoVideoURL
        },
        addedBy: {
          name: this.userData.profile.name,
          uid: this.uid
        },
        addedOn: Date.now(),
        episode: isEpisodePresent ? episodeArray : [],
        genre: this.addVideoForm.value.videoGenre,
        isActive: true,
        isSeries: isEpisodePresent,
        likes: {
          likes: 0,
          likedBy: []
        },
        sortOrder: 0,
        views: 0
      };
      this.firestoreDB.createNewVideoPlaylist(mainVideoData)
        .then((result: any) => {
          if (!result.error) {
            if (!forEditing) {
              this.toasterAlert.success('New Video Added!');
            } else {
              this.toasterAlert.success('Video Updated Successfully!');
            }
          }
        }).catch((error: any) => {
          this.toasterAlert.error(error.errorDetails);
        });
    }
  }


  addNewVideo() {
    const videoID = Date.now().toString();
    this.episodeArray = [];
    let isEpisodePresent = false;
    if (this.addVideoForm.value.videoEpisodeArray.length > 0) {
      isEpisodePresent = true;
      this.addVideoForm.value.videoEpisodeArray.forEach((element, i) => {
        const singleEpisode = {
          name: element.episodeName,
          description: element.episodeDescription,
          addedBy: {
            name: this.userData.profile.name,
            uid: this.uid
          },
          addedOn: Date.now(),
          likes: {
            likes: 0,
            likedBy: []
          },
          sortOrder: i,
          URL: {
            thumbnail: element.episodeThumbnailURL,
            video: element.episodeVideoURL
          },
          videoID: videoID + '-' + i,
          views: 0
        };
        this.episodeArray.push(singleEpisode);
        if (i === (this.addVideoForm.value.videoEpisodeArray.length - 1)) {
          this.addMainVideo(videoID, this.episodeArray, isEpisodePresent, false);
        }
      });
    } else {
      isEpisodePresent = false;
      this.addMainVideo(videoID, this.episodeArray, isEpisodePresent, false);
    }
  }

  editVideo() {
    const videoID = this.videoIDForEditing;
    this.editEpisodeArray = [];
    let isEpisodePresent = false;
    if (this.addVideoForm.value.videoEpisodeArray.length > 0) {
      isEpisodePresent = true;
      this.addVideoForm.value.videoEpisodeArray.forEach((element, i) => {
        let gotThat = false;
        let tempEpisodeArray: any;
        this.videoDataForEditing.episode.forEach((ele, index) => {
          if (ele.URL.video === element.episodeVideoURL) {
            gotThat = true;
            tempEpisodeArray = ele;
          }
          if (index === (this.videoDataForEditing.episode.length - 1)) {
            if (gotThat === true) {
              const episodeData = {
                name: element.episodeName,
                description: element.episodeDescription,
                addedBy: tempEpisodeArray.addedBy,
                addedOn: tempEpisodeArray.addedOn,
                likes: tempEpisodeArray.likes,
                sortOrder: i,
                URL: {
                  thumbnail: element.episodeThumbnailURL,
                  video: element.episodeVideoURL
                },
                videoID: videoID + '-' + i,
                views: tempEpisodeArray.views
              };
              this.editEpisodeArray.push(episodeData);
            } else {
              const singleEpisodeData = {
                name: element.episodeName,
                description: element.episodeDescription,
                addedBy: {
                  name: this.userData.profile.name,
                  uid: this.uid
                },
                addedOn: Date.now(),
                likes: {
                  likes: 0,
                  likedBy: []
                },
                sortOrder: i,
                URL: {
                  thumbnail: element.episodeThumbnailURL,
                  video: element.episodeVideoURL
                },
                videoID: videoID + '-' + i,
                views: 0
              };
              this.editEpisodeArray.push(singleEpisodeData);
            }
          }
        });
        if (i === (this.addVideoForm.value.videoEpisodeArray.length - 1)) {
          this.addMainVideo(videoID, this.editEpisodeArray, isEpisodePresent, true);
        }
      });
    } else {
      isEpisodePresent = false;
      this.addMainVideo(videoID, this.editEpisodeArray, isEpisodePresent, true);
    }
  }

}
  /*
    const autogeneratedID = Date.now().toString();
    const videoData = {
      videoID: autogeneratedID,
      isSeries: true,
      isActive: true,
      name: '',
      description: '',
      URL: {
        thumbnail: '',
        video: ''
      },
      addedOn: Date.now(),
      views: 0,
      sortOrder: 0,
      addedBy: {
        uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
        name: 'Amitabh Sharma'
      },
      likes: 0,
      genre: '',
      episode: [{
        videoID:  autogeneratedID + '-0',
        name: '',
        description: '',
        URL: {
          thumbnail: '',
          video: ''
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 0,
        addedBy: {
        uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
        name: 'Amitabh Sharma'
      },
        likes: 0
      }]
    };
  */

  // dummyButton() {
  //   const uuid = UUID.UUID();
  //   console.log('Auto generated--> ', uuid);
  //   //  this.firestoreDB.createNewVideoPlaylist(uuid);
  // }

  /*
  addDummyData() {
    const autogeneratedID = Date.now().toString();


    const videoData = {
      videoID: autogeneratedID,
      isSeries: true,
      isActive: true,
      name: 'High Altitude Warfare School | Veer by Discovery',
      description: 'High Altitude Warfare School. Watch the true story of Indian Army Mountain Warriors training to defend the highest battlefield in the world. ',
      URL: {
        thumbnail: 'https://img.youtube.com/vi/rAtJ9PoZ8ng/maxresdefault.jpg',
        video: 'https://www.youtube.com/watch?v=rAtJ9PoZ8ng'
      },
      addedOn: Date.now(),
      views: 0,
      sortOrder: 1,
      addedBy: {
        uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
        name: 'Amitabh Sharma'
      },
      likes: {
        likes: 0,
        likedBy: []
      },
      genre: 'People & Blogs',
      episode: [{
        videoID: autogeneratedID + '-0',
        name: 'Introduction to High Altitude Warfare School | HAWS E1P1 | Veer by Discovery',
        description: 'The first week of training entails a small walk of about 1.5 km with a little load on one’s back, which soon progresses to 5, 10 and 15 kilograms after two weeks, even as the distance increases and soldiers are introduced to tougher levels.',
        URL: {
          thumbnail: 'https://img.youtube.com/vi/bEI7jySEUyQ/maxresdefault.jpg',
          video: 'https://www.youtube.com/watch?v=bEI7jySEUyQ'
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 0,
        addedBy: {
          uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
          name: 'Amitabh Sharma'
        },
        likes: {
          likes: 0,
          likedBy: []
        },
      },
      {
        videoID: autogeneratedID + '-1',
        name: 'Mountain Survival Training for Indian Army Soldiers | HAWS E1P2 | Veer by Discovery',
        description: 'Selected Indian Army personnel are trained at HAWS to become mountain warriors. In the initial training, soldiers have to stay in the forest at survival top which is at a height of 10,500 feet. They are trained for survival instincts in bad weather conditions, freezing temperature and low level of oxygen.',
        URL: {
          thumbnail: 'https://img.youtube.com/vi/aOOmLTV_Oz8/maxresdefault.jpg',
          video: 'https://www.youtube.com/watch?v=aOOmLTV_Oz8'
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 1,
        addedBy: {
          uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
          name: 'Amitabh Sharma'
        },
        likes: {
          likes: 0,
          likedBy: []
        },
      },
      {
        videoID: autogeneratedID + '-2',
        name: 'Stream Crossing Training at High Altitude Warfare School | HAWS E1P3 | Veer by Discovery',
        description: 'During the 72 hours of mountain survival training at High Altitude Warfare School (HAWS) soldiers are trained for combat situations where they have to cross rapid currents of river virtually unaided. Watch India’s fiercest mountain warriors crossing the river stream within minutes. They are among the top instructors at HAWS, representing the nation at the International Army Games of Elbrus in Russia.',
        URL: {
          thumbnail: 'https://img.youtube.com/vi/elZiT2RIpFY/maxresdefault.jpg',
          video: 'https://www.youtube.com/watch?v=elZiT2RIpFY'
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 2,
        addedBy: {
          uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
          name: 'Amitabh Sharma'
        },
        likes: {
          likes: 0,
          likedBy: []
        },
      },
      {
        videoID: autogeneratedID + '-3',
        name: 'Endurance Run at 9000 Feet | High Altitude Warfare School E1P4 | Veer by Discovery',
        description: 'The Endurance Run at High Altitude Warfare School is an 18km long run in tough terrains with the finish line at a height of 9000 feet. It\'s a mental challenge and endurance test for trainee soldiers at HAWS to run with 18kg of battle load along with their personal weapons. Will they clear the litmus test for the toughest job in the world: defending India’s Himalayan borders. Watch this episode to find out.',
        URL: {
          thumbnail: 'https://img.youtube.com/vi/RdFYHrBo5rY/maxresdefault.jpg',
          video: 'https://www.youtube.com/watch?v=RdFYHrBo5rY'
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 3,
        addedBy: {
          uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
          name: 'Amitabh Sharma'
        },
        likes: {
          likes: 0,
          likedBy: []
        },
      },
      {
        videoID: autogeneratedID + '-4',
        name: 'Endurance Test: Making of Mountain Warriors | High Altitude Warfare School E1P5 | Veer by Discovery',
        description: 'The Endurance Run at High Altitude Warfare School is an 18km long run in tough terrains with the finish line at a height of 9000 feet. It\'s a mental challenge and endurance test for trainee soldiers at HAWS to run with 18kg of battle load along with their personal weapons. Will they clear the litmus test for the toughest job in the world: defending India’s Himalayan borders. Watch this episode to find out.',
        URL: {
          thumbnail: 'https://img.youtube.com/vi/TB_2e-ydGOI/maxresdefault.jpg',
          video: 'https://www.youtube.com/watch?v=TB_2e-ydGOI'
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 4,
        addedBy: {
          uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
          name: 'Amitabh Sharma'
        },
        likes: {
          likes: 0,
          likedBy: []
        },
      }
      ]
    };
    console.log(videoData);
    this.firestoreDB.createNewVideoPlaylist(videoData)
      .then((response: any) => {
        if (!response.error) {
          console.log('Created new playlist');
        }
      }).catch((error) => {
        console.log('Error----> ', error);
      });
  }
}
*/


/*
    const autogeneratedID = Date.now().toString();
    const videoData = {
      videoID: autogeneratedID,
      isSeries: true,
      isActive: true,
      name: 'Boston Dynamics',
      description: 'Boston Dynamics is an American engineering and robotics design company founded in 1992 as a spin-off from the Massachusetts Institute of Technology.',
      URL: {
        thumbnail: 'https://img.youtube.com/vi/LikxFZZO2sk/maxresdefault.jpg',
        video: 'https://www.youtube.com/watch?v=LikxFZZO2sk'
      },
      addedOn: Date.now(),
      views: 0,
      sortOrder: 0,
      addedBy: {
        uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
        name: 'Amitabh Sharma'
      },
      likes: 0,
      genre: 'Science & Technology',
      episode: [{
        videoID: autogeneratedID + '-0',
        name: 'UpTown Spot',
        description: 'This Clip Of Boston Dynamics Spot Dancing To Uptown Funk',
        URL: {
          thumbnail: 'https://img.youtube.com/vi/kHBcVlqpvZ8/maxresdefault.jpg',
          video: 'https://www.youtube.com/watch?v=kHBcVlqpvZ8'
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 0,
        addedBy: {
          uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
          name: 'Amitabh Sharma'
        },
        likes: 0
      },
      {
        videoID: autogeneratedID + '-1',
        name: 'The New SpotMini',
        description: 'SpotMini is a new smaller version of the Spot robot, weighing 55 lbs dripping wet (65 lbs if you include its arm.)  SpotMini is all-electric (no hydraulics) and runs for about 90 minutes on a charge, depending on what it is doing.',
        URL: {
          thumbnail: 'https://img.youtube.com/vi/kgaO45SyaO4/maxresdefault.jpg',
          video: 'https://www.youtube.com/watch?v=kgaO45SyaO4'
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 1,
        addedBy: {
          uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
          name: 'Amitabh Sharma'
        },
        likes: 0
      },
      {
        videoID: autogeneratedID + '-2',
        name: 'Atlas, The Next Generation',
        description: 'A new version of Atlas, designed to operate outdoors and inside buildings. It is specialized for mobile manipulation. It is electrically powered and hydraulically actuated.',
        URL: {
          thumbnail: 'https://img.youtube.com/vi/rVlhMGQgDkY/maxresdefault.jpg',
          video: 'https://www.youtube.com/watch?v=rVlhMGQgDkY'
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 2,
        addedBy: {
          uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
          name: 'Amitabh Sharma'
        },
        likes: 0
      }
      ]
    };



        const videoData = {
      videoID: autogeneratedID,
      isSeries: true,
      isActive: true,
      name: 'High Altitude Warfare School | Veer by Discovery',
      description: 'High Altitude Warfare School. Watch the true story of Indian Army Mountain Warriors training to defend the highest battlefield in the world. ',
      URL: {
        thumbnail: 'https://img.youtube.com/vi/rAtJ9PoZ8ng/maxresdefault.jpg',
        video: 'https://www.youtube.com/watch?v=rAtJ9PoZ8ng'
      },
      addedOn: Date.now(),
      views: 0,
      sortOrder: 1,
      addedBy: {
        uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
        name: 'Amitabh Sharma'
      },
      likes: 0,
      genre: 'People & Blogs',
      episode: [{
        videoID:  autogeneratedID + '-0',
        name: 'Introduction to High Altitude Warfare School | HAWS E1P1 | Veer by Discovery',
        description: 'The first week of training entails a small walk of about 1.5 km with a little load on one’s back, which soon progresses to 5, 10 and 15 kilograms after two weeks, even as the distance increases and soldiers are introduced to tougher levels.',
        URL: {
          thumbnail: 'https://img.youtube.com/vi/bEI7jySEUyQ/maxresdefault.jpg',
          video: 'https://www.youtube.com/watch?v=bEI7jySEUyQ'
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 0,
        addedBy: {
        uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
        name: 'Amitabh Sharma'
      },
        likes: 0
      },
      {
        videoID:  autogeneratedID + '-1',
        name: 'Mountain Survival Training for Indian Army Soldiers | HAWS E1P2 | Veer by Discovery',
        description: 'Selected Indian Army personnel are trained at HAWS to become mountain warriors. In the initial training, soldiers have to stay in the forest at survival top which is at a height of 10,500 feet. They are trained for survival instincts in bad weather conditions, freezing temperature and low level of oxygen.',
        URL: {
          thumbnail: 'https://img.youtube.com/vi/aOOmLTV_Oz8/maxresdefault.jpg',
          video: 'https://www.youtube.com/watch?v=aOOmLTV_Oz8'
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 1,
        addedBy: {
        uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
        name: 'Amitabh Sharma'
      },
        likes: 0
      },
      {
        videoID:  autogeneratedID + '-2',
        name: 'Stream Crossing Training at High Altitude Warfare School | HAWS E1P3 | Veer by Discovery',
        description: 'During the 72 hours of mountain survival training at High Altitude Warfare School (HAWS) soldiers are trained for combat situations where they have to cross rapid currents of river virtually unaided. Watch India’s fiercest mountain warriors crossing the river stream within minutes. They are among the top instructors at HAWS, representing the nation at the International Army Games of Elbrus in Russia.',
        URL: {
          thumbnail: 'https://img.youtube.com/vi/elZiT2RIpFY/maxresdefault.jpg',
          video: 'https://www.youtube.com/watch?v=elZiT2RIpFY'
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 2,
        addedBy: {
        uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
        name: 'Amitabh Sharma'
      },
        likes: 0
      },
      {
        videoID:  autogeneratedID + '-3',
        name: 'Endurance Run at 9000 Feet | High Altitude Warfare School E1P4 | Veer by Discovery',
        description: 'The Endurance Run at High Altitude Warfare School is an 18km long run in tough terrains with the finish line at a height of 9000 feet. It\'s a mental challenge and endurance test for trainee soldiers at HAWS to run with 18kg of battle load along with their personal weapons. Will they clear the litmus test for the toughest job in the world: defending India’s Himalayan borders. Watch this episode to find out.',
        URL: {
          thumbnail: 'https://img.youtube.com/vi/RdFYHrBo5rY/maxresdefault.jpg',
          video: 'https://www.youtube.com/watch?v=RdFYHrBo5rY'
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 3,
        addedBy: {
        uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
        name: 'Amitabh Sharma'
      },
        likes: 0
      },
      {
        videoID:  autogeneratedID + '-4',
        name: 'Endurance Test: Making of Mountain Warriors | High Altitude Warfare School E1P5 | Veer by Discovery',
        description: 'The Endurance Run at High Altitude Warfare School is an 18km long run in tough terrains with the finish line at a height of 9000 feet. It\'s a mental challenge and endurance test for trainee soldiers at HAWS to run with 18kg of battle load along with their personal weapons. Will they clear the litmus test for the toughest job in the world: defending India’s Himalayan borders. Watch this episode to find out.',
        URL: {
          thumbnail: 'https://img.youtube.com/vi/TB_2e-ydGOI/maxresdefault.jpg',
          video: 'https://www.youtube.com/watch?v=TB_2e-ydGOI'
        },
        addedOn: Date.now(),
        views: 0,
        sortOrder: 5,
        addedBy: {
        uid: 'AyMMm1Y7LrZ0qEKQv7y88wb5hzy1',
        name: 'Amitabh Sharma'
      },
        likes: 0
      }
    ]
    };
*/
