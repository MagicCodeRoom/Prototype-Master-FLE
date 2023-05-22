from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Profile, ReadyRoom
import json

class ConsumerTest(WebsocketConsumer):

    print("***888***8**8**88")
    def connect(self):
        print("***888***8**8**884")
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
    def disconnect(self, close_code):
        print("***888***8**8**888")
        # Leave room group / on peut utiliser ça ici pour update la base de donné
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # how to know who is in state connected on the websocket
    # keep connections state on DB and when connection out , deleted ?
    def connection_in(self, data):
        class_number = data["class_number"]
        print("is>>>>>>>>", type(class_number))
        user_is = data["username"]
        group_ss = Profile.objects.filter(class_number= class_number)
        group_ss_list = list(group_ss)
        ss_list = []

        for ss in group_ss_list :
            name = ss.ss_name
            print(f'{user_is} et {name}')
            if user_is != name:
                ss_list.append(ss.ss_name)
            
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                'type': "connection_out",
                "ss_list": ss_list
            })
    #connection out n'est pas déconnexion ! C'est part2 de Connection justement!!!
    def connection_out(self, data):
    
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            "user_type": 1,
            "action_type": "connection",
            "ss_list": data["ss_list"]
        }))


    def handle_offer(self,data):

        # save offer to the guest
        class_number = data["class_number"]
        offerFor= data["offerFor"]
       
        offer_from = data["offerFrom"]
        sdp_offer = data["sdp"]
        # why get didnt work here ?
        
        guest = Profile.objects.get(ss_name= offerFor)
        
        guest.offer_box = json.dumps(data["sdp"])
       
        guest.save()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                'type': "offer_out",
                "offer_in_for": offerFor,
                "class_number": class_number,
                "offer_from": offer_from,
                "sdp_offer":sdp_offer 
            
            })

    def offer_out(self, data):
        #we need to set up the local storage and the refresh. On two browser we will have two diff users 
        # on user is the guest and will match the offer_out, then He has a button to accept the offer and
        # create the answer back 
        self.send(text_data= json.dumps({
            'user_type':1 ,
            "action_type": "offer_out",
            "offer_out_for": data["offer_in_for"],
            "offer_from": data["offer_from"],
            "class_number": data["class_number"],
            "sdp_offer": data["sdp_offer"]
            
        }))

    def handle_answer_in(self, data):
        userAnswering = data["userAnswering"]
        answeringTo = data["answeringTo"]
        class_number = data["class_number"]
        sdp = data["sdp"]
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                'type': "handle_answer_out",
                "user_answering":userAnswering,
                "answeringTo" : answeringTo,
                "class_number" : class_number,
                "sdp": sdp
                
            
            })

    def handle_answer_out(self, data):
        userAnswering = data["user_answering"]
        answeringTo = data["answeringTo"]
        class_number = data["class_number"]
        sdp = data["sdp"]
        # attention avec le mocking user type 
        self.send(text_data= json.dumps({
            'user_type':1 ,
            "action_type": "handle_answer_out",
            "user_answering":userAnswering,
            "answeringTo" : answeringTo,
            "class_number" : class_number,
            "sdp": sdp
      
        }))

    def ice_in(self, data):
        candidates = data["candidates"]
        ice_for = data["IceFor"]
        print(">>>>???", ice_for)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                'type': "ice_out",
                "candidates":candidates,
                "ice_for": ice_for 
            })
    
    def ice_out(self, data):
        print("sending", data)
        self.send(text_data= json.dumps({
            'user_type':1 ,
            "action_type": "ice_out",
            "candidates":data["candidates"],
            "ice_for" : data["ice_for"] ,
            # "class_number" : class_number,
            # "sdp": sdp
      
        }))

    def keyDownEvent_in(self, data):
            print('datae key', data["code"])
            code = data["code"]
            msg_for = data["msg_for"]


            async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                'type': "keyDownEvent_out",
                "msg_for" : msg_for ,
                "code": code,

                
            })

    def placeAtIn(self, data):
          async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                'type': "placeAtOut",
                "tiles_to" : data["tiles_to"] ,
                "msg_for" : data["msg_for"] 
            })
    
    def placeAtOut(self, data):
        self.send(text_data= json.dumps({
            'user_type':1 ,
            "action_type": "placeAtOut",
            "tiles_to" : data["tiles_to"],
            "msg_for" : data["msg_for"] , 
   
        }))

    def stageOneIn(self, data):
        async_to_sync(self.channel_layer.group_send)(
        self.room_group_name,
        {   
            'type': "stageOneOut",
            "position01" : data["data"] ,
            "msg_for" : data["msg_for"] 
        })
    
    def stageOneOut(self, data):
        self.send(text_data= json.dumps({
            'user_type':1 ,
            "action_type": "stageOneOut",
            "position01"  : data["position01"],
            "msg_for" : data["msg_for"] , 
   
        }))
    
    def stageTwoIn(self, data):
        async_to_sync(self.channel_layer.group_send)(
        self.room_group_name,
        {   
            'type': "stageTwoOut",
            "position0" : data["data"] ,
            "msg_for" : data["msg_for"] 
        })
    
    def stageTwoOut(self,data):
        self.send(text_data= json.dumps({
            'user_type':1 ,
            "action_type": "stageTwoOut",
            "position0" : data["position0"],
            "msg_for" : data["msg_for"] , 
   
        }))
    
    def stageThreeIn(self, data):
        async_to_sync(self.channel_layer.group_send)(
        self.room_group_name,
        {   
            'type': "stageThreeOut",
            "position1" : data["data"] ,
            "msg_for" : data["msg_for"] 
        })
    
    def stageThreeOut(self, data):
        self.send(text_data= json.dumps({
            'user_type':1 ,
            "action_type": "stageThreeOut",
            "position1" : data["position1"],
            "msg_for" : data["msg_for"] , 
   
        }))
    
    def stageFourIn(self, data):
        async_to_sync(self.channel_layer.group_send)(
        self.room_group_name,
        {   
            'type': "stageFourOut",
            "position01" : data["data"] ,
            "msg_for" : data["msg_for"] 
        })
    
    def stageFourOut(self, data):
        self.send(text_data= json.dumps({
            'user_type':1 ,
            "action_type": "stageFourOut",
            "position01" : data["position01"],
            "msg_for" : data["msg_for"] , 
   
        }))
    
    def stageFiveIn(self, data):
        async_to_sync(self.channel_layer.group_send)(
        self.room_group_name,{   
            'type': "stageFiveOut",
            "move": data["move"],
            "tileTo": data["tileTo"],
            "tileFrom":data["tileFrom"],
            "msg_for": data["msg_for"],
            "time": data["time"],
            "direction": data["direction"]

        })
    
    def stageFiveOut(self, data):
        self.send(text_data= json.dumps({
            "action_type": "position",
            "move": data["move"],
            "tileTo": data["tileTo"],
            "tileFrom":data["tileFrom"],
            "msg_for": data["msg_for"],
             "time": data["time"],
             "direction": data["direction"]

        }))


    def matchSS_in(self, data):
        # on connection we need to know who is connected so we can put them together to play
        # create pairs of students player / guider
        class_number = data["class_group"]
        ss_group = Profile.objects.filter(class_number=class_number)
        ss_names = []
        for ss in ss_group:
            ss_names.append(ss.ss_name)
        unpairs = ss_names[::2]
        pairs = ss_names[1::2]
        ss_pairs = []
        #or len(unpairs)==1 and len(pairs)==0
        # if len(pairs)!= len(unpairs) :
        #some students will not have pairs => play with the teacher
        for i in range(len(unpairs)):
            ss_pairs.append({"player":pairs[i],"guider":unpairs[i]})
        print("-------------", unpairs, pairs, ss_pairs)

        async_to_sync(self.channel_layer.group_send)(
        self.room_group_name,
        {   
            'type': "matchSS_out",
            'user_type':1 ,
            "ss_pairs": ss_pairs,
        })


    def matchSS_out(self,data):
        # is this going to everyone ? 
        self.send(text_data= json.dumps({
        "action_type": "matchSS_out",
        'user_type':1 ,
        "ss_pairs":data["ss_pairs"]
        }))

    def tester_in(self, data):
        print(".....1", data)
        async_to_sync(self.channel_layer.group_send)(
        self.room_group_name,
        {   
            'type': "tester_out",
            "ss_pairs": "yoooo",
        })

    def tester_out(self,data):
            print(".....2", data)
            # is this going to everyone ? 
            self.send(text_data= json.dumps({
            "action_type": "tester_out",
            "ss_pairs":"heyyyy"
            }))


    def KeyDown_in(self, data):
        print("key down")
        async_to_sync(self.channel_layer.group_send)(
        self.room_group_name,
        {   
            'type': "KeyDown_out",
            "tilesTo": data["tilesTo"],
            "key": data["key"],
            "msg_for": data["msg_for"]

        })
    
    def KeyDown_out(self, data):
        print("key down out")
        self.send(text_data= json.dumps({
            "action_type": "KeyDown",
            "tilesTo": data["tilesTo"],
            "key": data["key"],
            "msg_for": data["msg_for"]
            }))

    
    def keyUp_in(self, data):
        print("key up")
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                "type": "keyUp_out",
                "key": data["key"],
                "msg_for": data["msg_for"]
            })

    def keyUp_out(self, data):
        print("key up out")
        self.send(text_data= json.dumps({
                "action_type": "keyUp",
                "key": data["key"],
                "msg_for": data["msg_for"]
                }))

    def tilesTo_in(self, data):
        print("tilesout")
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                "type": "tilesTo_out",
                "tilesTo": data["tilesTo"],
            })

    def tilesTo_out(self, data):
        print("tilesout")
        self.send(text_data= json.dumps({
                "action_type": "tilesTo",
                "tilesTo": data["tilesTo"],
                }))



    def reload_in(self, data):
    
        
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                "type": "reload_out",
                # "msg_for": data["msg_for"],
                "tilesTo": data["tilesTo"],


            })

    def reload_out(self, data):
        self.send(text_data= json.dumps({
                "action_type": "reload",
                # "msg_for": data["msg_for"],
                "tilesTo": data["tilesTo"],


                }))



    def triggerTalk_in(self, data):
            async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                "type": "triggerTalk_out",
                # "msg_for": data["msg_for"],

            })

    def triggerTalk_out(self, data):
            self.send(text_data= json.dumps({
            "action_type": "triggerTalk",
            # "msg_for": data["msg_for"],

            }))

    def pressA_in(self, data):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                "type": "pressA_out",
                "codeInput": data["codeInput"]
                # "msg_for": data["msg_for"],

            })

    def pressA_out(self, data):
        self.send(text_data= json.dumps({
            "action_type": "pressA",
            "codeInput": data["codeInput"]
            # "msg_for": data["msg_for"],

            }))


    def endInteraction_in(self, data):  
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                "type": "endInteraction_out",
                "msg_for": data["msg_for"],

            })
        
    def endInteraction_out(self, data): 
        self.send(text_data= json.dumps({
            "action_type": "endInteraction",
            "msg_for": data["msg_for"],

            }))

    def pickUp_in(self, data):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                "type": "pickUp_out",
            })


    def pickUp_out(self, data):
        self.send(text_data= json.dumps({
            "action_type": "pickUp",
            }))

    def visibility_in(self, data):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                "type": "visibility_out",
                "status": data["status"]
            })

    def visibility_out(self, data):
        self.send(text_data= json.dumps({
            "action_type": "visibility",
            "status": data["status"]
            }))




    def readyCheck_in(self, data):

        if ReadyRoom.readyState==False:
            ReadyRoom.readyName = data["meReady"]
            ReadyRoom.readyState = True

            print(".....1", ReadyRoom.readyName )

        else:
            isReady = ReadyRoom.readyName 
            ReadyRoom.readyState = False

            print(".....2", ReadyRoom.readyState)
            async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {   
                "type": "readyCheck_out",
                "playerA":isReady,
                "playerB": data["meReady"],
            })

    def readyCheck_out(self, data):
        self.send(text_data= json.dumps({
        "action_type": "readyCheck",
        "playerA":  data["playerA"],
        "playerB": data["playerB"],

        }))


    # step 2
    commands ={
        "connection": connection_in,
        "matchSS": matchSS_in,
        "connection_out": connection_out,
        "offer": handle_offer,
        "answerOffer": handle_answer_in,
        "sendIce" : ice_in,
        "placeAt": placeAtIn,
        "stage_1": stageOneIn,
        "stage_2": stageTwoIn,
        "stage_3": stageThreeIn,
        "stage_4": stageFourIn,
        "stage_5": stageFiveIn,
        "tester": tester_in,
        "KeyDown": KeyDown_in,
        "KeyUp": keyUp_in,
        "tilesTo": tilesTo_in,
        "reload": reload_in,
        "triggerTalk":triggerTalk_in,   
        "pressA": pressA_in,
        "endInteraction" : endInteraction_in,
        "pickUp": pickUp_in,
        "visibility": visibility_in,
        "readyCheck": readyCheck_in,
        
    }
    
    # step 1
    def receive(self, text_data):
        # print(">>>>>>",text_data)
        data = json.loads(text_data)
        self.commands[data['command']](self,data)  

 