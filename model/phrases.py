phrases = {
    "Good_Morning_Father": "Good Morning Father",
    "Good_Morning_Mother": "Good Morning Mother",
    "Good_Afternoon_Father": "Good Afternoon Father",
    "Good_Afternoon_Mother": "Good Afternoon Mother",
    "Good_Night_Father": "Good Night Father",
    "Good_Night_Mother": "Good Night Mother",
    "Hello_Boss": "Hello Boss",
    "Hello_Father": "Hello Father",
    "Hello_Mother": "Hello Mother",
    "I_love_you": "I love you",
    "I_See_You": "I see you",
    "You_See_Me": "You see me?",
    "You_Are_Mine": "You are mine",
    "How_Are_You": "How are you?",
    "Give_Me_Water": "Give me water",
    "Are_You_Serious": "Are you serious?",
    "Give_Me_This": "Give me this",
    "You_Are_Good": "You are good",
    "Wait_Boss": "Wait boss",
    "Are_You_Good": "Are you good?",
    "I": "I",
    "Are": "Are",
    "You": "You",
    "Me": "Me",
    "Mine": "Mine",
    "Good": "Good",
    "Morning": "Morning",
    "Afternoon": "Afternoon",
    "Night": "Night",
    "Mother": "Mother",
    "Father": "Father",
    "Boss": "Boss",
    "Water": "Water",
    "Hello": "Hello",
    "See": "See",
    "Give": "Give",
    "How": "How?",
    "Serious": "Serious",
    "This": "This",
    "Wait": "Wait",
    "Think": "Think",
    "Quiet": "Quiet",
}

predictions_list = []

def check_if_phrase(class_name):
    global predictions_list
    if len(class_name) < 2 and class_name != "I":
        return class_name
    
    if class_name in predictions_list:
        predictions_list.remove(class_name)

    elif len(predictions_list) > 2:
        predictions_list.pop(0)
    
    predictions_list.append(class_name)

    result = ""

    if len(predictions_list) > 0:
        result = phrases.get(predictions_list[-1], result)
    if len(predictions_list) > 1:
        result = phrases.get("_".join(predictions_list[-2:]), result)
    if len(predictions_list) > 2:
        max_phrase = phrases.get("_".join(predictions_list), result)
        if max_phrase != result:
            predictions_list = []
        result = max_phrase

    return result

    