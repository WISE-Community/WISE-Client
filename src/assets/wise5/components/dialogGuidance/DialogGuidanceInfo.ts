import { ComponentInfo } from '../ComponentInfo';

export class DialogGuidanceInfo extends ComponentInfo {
  protected description: string = $localize`Students chat with a computer avatar about a specific topic.`;
  protected label: string = $localize`Dialog Guidance`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'DialogGuidance',
    itemId: 'PhotoEnergyStory_score-ki_idea-ki_nonscore',
    version: 2,
    feedbackRules: [
      {
        id: '6encpml66s',
        expression: 'isFinalSubmit',
        feedback: [
          'Thanks for chatting with me! Now revise your response based on the ideas you shared in the chat.'
        ]
      },
      {
        id: 'ixvd0iaxh7',
        expression: 'isSubmitNumber(2) && 13a',
        feedback: [
          'I agree that animals get energy from sleeping and eating. Where does the energy in their food come from?'
        ]
      },
      {
        id: 'dculqoydzc',
        expression: '13a',
        feedback: [
          'I agree that animals need sleep! What other types of energy can animals get from the sun?'
        ]
      },
      {
        id: 'lm0odmyxre',
        expression: 'isSubmitNumber(2) && 4a',
        feedback: ['How do plants get energy from the sun, differently than animals?']
      },
      {
        id: '1urvciu5sy',
        expression: '4a',
        feedback: [
          'Interesting Idea! Where does the energy originally come from? How is the energy transformed in the process?'
        ]
      },
      {
        id: 'jv23u1nmxj',
        expression: 'isSubmitNumber(2) && 4b',
        feedback: [
          'You are thinking like a scientist! Where does the energy come from? What type of energy is released in this process?'
        ]
      },
      {
        id: 'irhj6xhvft',
        expression: '4b',
        feedback: [
          'Interesting Idea! What is the glucose made from? What happened to the molecules? '
        ]
      },
      {
        id: 'uubc2szgcm',
        expression: 'isSubmitNumber(2) && 6b',
        feedback: [
          'Interesting idea. When the animal eats plants, how is the energy transferred from plants to animals?'
        ]
      },
      {
        id: '617hd0zsmt',
        expression: '6b',
        feedback: [
          'Nice thinking! Where does the plant-stored glucose go? What happened to the part of glucose that hasn’t been used for plant growth?'
        ]
      },
      {
        id: '6n643zmexn',
        expression: 'isSubmitNumber(2) && 6c',
        feedback: [
          'Interesting idea. How is the energy transformed from the plants to animals in this process?'
        ]
      },
      {
        id: 'gxoeeryzyw',
        expression: '6c',
        feedback: ['Nice thinking! What type of energy is released during cellular respiration?']
      },
      {
        id: 'rjvjxzn8fi',
        expression: 'isSubmitNumber(2) && 11a',
        feedback: [
          'The sun helps animals in lots of ways! How do you think the sun helps animals get energy from food?'
        ]
      },
      {
        id: 'kl5zguma0m',
        expression: '11a',
        feedback: [
          'I agree that animals can directly use the sun’s energy. What are other sources of energy that animals can get from their food?'
        ]
      },
      {
        id: 'sf8ttj8pzf',
        expression: 'isSubmitNumber(2) && 11b',
        feedback: [
          'I agree that too much sun can be harmful. Imagine what would happen to plants if there were no sunlight. How do you think the sun helps animals get energy from food?'
        ]
      },
      {
        id: 'g056fzgmij',
        expression: '11b',
        feedback: [
          'Hmm, too much sun can be harmful. What other impacts does the sun’s energy have on animals?'
        ]
      },
      {
        id: 't1mhcn37qi',
        expression: 'isSubmitNumber(2) && 9a',
        feedback: [
          'I enjoy hearing your thoughts. Where does the energy in the plant come from and how does it get used by the animal?'
        ]
      },
      {
        id: 'm1hofcqj7a',
        expression: '9a',
        feedback: [
          'Nice thinking! How is the energy from the sun transformed so the animal can use it?'
        ]
      },
      {
        id: 'yfm6esxnde',
        expression: 'isSubmitNumber(2) && 12b',
        feedback: [
          'Interesting idea. When the animal eats plants, how does the animal get the energy it needs from the plant it ate - what is the process?'
        ]
      },
      {
        id: 'pwmhvfbdo5',
        expression: '12b',
        feedback: [
          'Nice thinking! Can you tell me more about the process that transfers energy from the plant to the animal?'
        ]
      },
      {
        id: 'xx1w3rs1cb',
        expression: 'isSubmitNumber(2) && 6a',
        feedback: [
          'Interesting idea. When the animal eats plants, what happens to the stored glucose?'
        ]
      },
      {
        id: '46duvz3re6',
        expression: '6a',
        feedback: ['Nice thinking! What is the stored glucose used for?']
      },
      {
        id: 'cfp2kn3fxy',
        expression: 'isSubmitNumber(2) && 3a',
        feedback: [
          'I like hearing your thoughts. What do you think the plant does with the usable energy?'
        ]
      },
      {
        id: 'w43b2yu1p5',
        expression: '3a',
        feedback: [
          'Nice thinking about how plants convert light energy to usable energy. How does this energy go from the plant to the animal?'
        ]
      },
      {
        id: 'vcqortmk5q',
        expression: 'isSubmitNumber(2) && 3b',
        feedback: [
          'Interesting idea about photosynthesis! How does the energy from plants get to an animal?'
        ]
      },
      {
        id: '26uhwx54e2',
        expression: '3b',
        feedback: [
          'Nice thinking about photosynthesis. How are the products of photosynthesis useful for animals?'
        ]
      },
      {
        id: 'od5s1no0b4',
        expression: 'isSubmitNumber(2) && 2',
        feedback: [
          'I like hearing your thoughts. How do you think animals make use of the glucose or oxygen produced by plants during photosynthesis?'
        ]
      },
      {
        id: '62scpp3ndm',
        expression: '2',
        feedback: [
          'Interesting idea about the products of photosynthesis. How are the products useful for animals?'
        ]
      },
      {
        id: 'ac4nazjj8l',
        expression: 'isSubmitNumber(2) && 1',
        feedback: [
          'I like hearing your thoughts. How does photosynthesis help the animal get energy?'
        ]
      },
      {
        id: 'wi5dtcmlgu',
        expression: '1',
        feedback: [
          'Nice thinking. You mentioned the inputs of photosynthesis.  Can you tell me more about what happens during photosynthesis?'
        ]
      },
      {
        id: 'sffk18map8',
        expression: 'isSubmitNumber(2) && 4c',
        feedback: [
          'I like your idea about energy conservation. Do you think energy is transformed into different types in the food chain? If so, how?'
        ]
      },
      {
        id: '581eophtvi',
        expression: '4c',
        feedback: [
          'I agree about energy conservation! How does energy get transferred in this process?'
        ]
      },
      {
        id: '8qo8p60wtg',
        expression: 'isSubmitNumber(2) && 4d',
        feedback: ['If energy starts with the sun, how does it move through the food chain? ']
      },
      {
        id: 'wylrvpkf22',
        expression: '4d',
        feedback: [
          'Hmmm, I wonder how the energy decreases down the food chain. Tell me more about how energy moves through the food chain.'
        ]
      },
      {
        id: '2uqgi6lp0l',
        expression: 'isSubmitNumber(2) && 9',
        feedback: [
          'What happens when animals get the glucose from plants? How does the animal use the energy from glucose?'
        ]
      },
      {
        id: '6rvyqj6rnt',
        expression: '9',
        feedback: [
          'How does the animal get and use the glucose? What changes does the animal make to the glucose?'
        ]
      },
      {
        id: 'ffdkkanuae',
        expression: 'isSubmitNumber(2) && 11',
        feedback: ['How does energy from the sun get to animals to help them survive?']
      },
      {
        id: 'ow60yaplo2',
        expression: '11',
        feedback: [
          'I see, you are saying that animals need the sun to survive. Can you give me an example of how the sun helps animals?'
        ]
      },
      {
        id: '2mupe6xoyy',
        expression: 'isSubmitNumber(2) && 3',
        feedback: [
          'What else do plants need to grow other than the sun? What happens inside plants for the sun to help them grow??'
        ]
      },
      {
        id: 'zbus61wnqy',
        expression: '3',
        feedback: ['Can you tell me more about how the Sun helps plants survive?']
      },
      {
        id: 'uc4d6jj3zi',
        expression: 'isSubmitNumber(2) && 12',
        feedback: [
          'I enjoy hearing your thoughts. Can you tell me more about how the energy from the sun is transferred from plants to animals?'
        ]
      },
      {
        id: 'fm7wctlxpr',
        expression: '12',
        feedback: ['Interesting idea! What type of energy do animals get from plants?']
      },
      {
        id: 'dzm7j60m0t',
        expression: 'isDefault',
        feedback: [
          'Can you tell me more about this idea or another one in your explanation? I am still learning about student ideas to become a better thought partner.',
          'How does the energy transfer from the sun to the plants and then to the animals?'
        ]
      }
    ],
    maxSubmitCount: 3,
    showSubmitButton: false,
    showSaveButton: false,
    prompt: '',
    computerAvatarSettings: {
      ids: [
        'person1',
        'person2',
        'person3',
        'person4',
        'person5',
        'person6',
        'person7',
        'person8',
        'robot1',
        'robot2'
      ],
      label: 'Thought Buddy',
      prompt:
        '<p><b>Discuss with a thought buddy.</b></p><p>Your buddy will ask you to explain your thinking and compare your response to responses from other students around the country.</p>Then your buddy will ask you some questions.',
      initialResponse:
        'Hi Preview User!<br>How do you think animals get and use energy from the sun to survive?</br>',
      useGlobalComputerAvatar: false
    },
    isComputerAvatarEnabled: true,
    constraints: []
  };
}
