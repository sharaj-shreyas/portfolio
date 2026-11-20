/*
  PROJECTS
  ------------------------------------------------------------------
  This is the only place to edit the project list. The page builds
  the cards, numbers them, creates the filter buttons and updates
  every count from this list.

  Add a project by copying a line and changing it:

    { title: 'Project name', category: 'Robotics', note: 'Optional one-liner', link: 'https://...' },

  title     Required.
  category  Required. A new category name adds a new filter button.
  note      Optional. Leave it out for a title-only card.
  link      Optional. Makes the title clickable (GitHub, video, write-up).

  Cards appear in the order listed here.
*/

window.PROJECTS = [
  /*{ title: 'Small weight class battlebots', category: 'Robotics' },*/
  { title: 'Soccer bots', category: 'Robotics', note: 'Two weight classes: 3 kg and 1 kg.' },
  { title: 'Line follower bot', category: 'Robotics' },
  { title: 'Prosthetic arm', category: 'Robotics' },

  { title: '8-bit computer', category: 'Electronics' },
  { title: '10×10×10 LED cube', category: 'Electronics', note: '1,000 LEDs, ten to a side.' },
  { title: 'Headphone amps', category: 'Electronics', note: 'Designed, built and sold directly.' },
  { title: 'Cheap ECG machine', category: 'Electronics' },
  { title: 'Useless machine', category: 'Electronics' },
  { title: 'Arduino and microcontroller projects', category: 'Electronics' },

  { title: 'RC planes', category: 'Flight & RC' },
  { title: 'RC cars and boats', category: 'Flight & RC' },
  { title: 'Flight simulator yoke setup', category: 'Flight & RC' },

  { title: 'DuelMaze', category: 'Games', note: 'A fun two-player physical maze game.' },
  { title: 'Memory game', category: 'Games' },

  { title: 'A new construction material', category: 'Science', note: 'Made from organic compounds.' },
  { title: 'Biofloc fish farming', category: 'Agriculture', note: 'A project on Biofloc fish farming techniques.' },
  { title: 'Agriculture automation', category: 'Agriculture' },
];
