/*
  PROJECTS
  ------------------------------------------------------------------
  This is the only place to edit the project list. The page builds
  the index rows, numbers them, creates the filter buttons and
  updates every count from this list.

  Add a project by copying a line and changing it:

    { title: 'Project name', category: 'Robotics', year: '2025', note: 'One or two lines about it.', image: 'assets/projects/photo.jpg', link: 'https://...' },

  title     Required.
  category  Required. A new category name adds a new filter button.
  year      Optional. Shown next to the category.
  note      Optional. Shown when the row is opened.
  image     Optional. A photo in the assets/projects folder. Shows in
            the hover preview and when the row is opened.
  link      Optional. Adds a "View project" link (GitHub, video, write-up).

  A row with a note, image or link opens on click; a row with only a
  title and category stays a single line.
  Rows appear in the order listed here.
*/

window.PROJECTS = [
  { title: 'Chadermod', category: 'Robotics', note: 'A 3 lb battlebot. Shown in 3D at the top of this section, from its CAD.' },
  { title: 'Soccer bots', category: 'Robotics', note: 'Built in two weight classes, 3 kg and 1 kg. Soccer bots were among the robotics projects run at Makerspace CFAL for events and demonstrations.' },
  { title: 'Line follower bot', category: 'Robotics' },
  { title: 'Prosthetic arm', category: 'Robotics' },

  { title: '8-bit computer', category: 'Electronics' },
  { title: '10×10×10 LED cube', category: 'Electronics', note: '1,000 LEDs, ten to a side.' },
  { title: 'Headphone amps', category: 'Electronics', note: 'Designed and built at Makerspace CFAL, then sold directly.' },
  { title: 'Cheap ECG machine', category: 'Electronics' },
  { title: 'Useless machine', category: 'Electronics' },
  { title: 'Arduino and microcontroller projects', category: 'Electronics' },

  { title: 'RC planes', category: 'Flight & RC', note: 'Including Scout, shown in 3D at the top of this section, from its CAD.' },
  { title: 'RC cars and boats', category: 'Flight & RC' },
  { title: 'Flight simulator yoke setup', category: 'Flight & RC' },

  { title: 'DuelMaze', category: 'Games', note: 'A fun two-player physical maze game.' },
  { title: 'Memory game', category: 'Games' },

  { title: 'A new construction material', category: 'Science', note: 'A project on a new construction material made from organic compounds.' },
  { title: 'Biofloc fish farming', category: 'Agriculture', note: 'A project on Biofloc fish farming techniques.' },
  { title: 'Agriculture automation', category: 'Agriculture' },
];
