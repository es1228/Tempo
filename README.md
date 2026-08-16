# Tempo
A simple chess site to review games, play in person, or practice against an engine.

# Why I Made This
I play chess and was thinking that it would be an interesting project to create my own game review site using the stockfish engine. Sites like Lichess or WintrChess exist, but I thought it would be a good summer project to make my own mini version of these analysis sites.

# Screenshots
<img width="1919" height="908" alt="image" src="https://github.com/user-attachments/assets/2baed429-96e8-4819-bc31-023d881ea016" />
<img width="1919" height="908" alt="image" src="https://github.com/user-attachments/assets/802c0313-392b-45e6-9f40-94877f5db7cc" />
<img width="1918" height="909" alt="image" src="https://github.com/user-attachments/assets/d934aedb-b32c-41f5-8f0d-683f366faf5b" />
<img width="1914" height="901" alt="image" src="https://github.com/user-attachments/assets/40615a24-0e83-488d-a5b9-de63fb589ab9" />
<img width="1919" height="905" alt="image" src="https://github.com/user-attachments/assets/e5966531-8596-4669-a784-31243a7a1b78" />
<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/8c1ef7d2-a2d2-4c50-958d-7ace47b1787c" />

# Features
- Game Review: Check how well you played in your previous games by simply entering your chess.com username or by manually loading a pgn file.
  - Move Feedback: Instant updates on how well the engine thinks your move is.
  - Move Classifications: How well the engine evaluates your moves. Classifications such as Miss, Great, or Brilliant are also included.
  - Engine Lines: What the engine thinks is the best line to play in a position.
  - Accuracies: How accurate you played relative to the best moves
  - Graph: A visual and interactive graph on how much your expected win percentage changed throughout a game
  - Classification Report: A total summary of how many of each type of move you played
  - History Tree: View the total game history and easily branch off the main path.
- Play: Play against a friend in person, or play against the engine. Custom positions can be used as well.
- Custom Positions: Set up a custom position to load later.
- Settings: Change the app or board theme.

# Tech Stack
- React 19 for the site
- TailwindCSS v4 for styling
- Stockfish.js for engine data
- React-Chessboard for chessboard logic
- Chess.com PubAPI for game imports

# Contribiting
Feel free to contribute to the project.

# License
GNU GPL v3
