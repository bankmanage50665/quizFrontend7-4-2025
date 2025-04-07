import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import { NavLink } from "react-router";
import { Link } from "react-router-dom";

// Dark Theme Configuration
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
  },
});

export default function QuizDashboard({ quizData }) {
  // State Management
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quizAttempts, setQuizAttempts] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery(darkTheme.breakpoints.down("sm"));

  // Filter States
  const [filters, setFilters] = useState({
    status: "all",
    correctness: "all",
    difficulty: "all",
    subject: "all",
  });

  // Unique Filters Extraction
  const uniqueSubjects = [
    "all",
    ...new Set(quizData?.map((quiz) => quiz.subject)),
  ];
  const uniqueDifficulties = [
    "all",
    ...new Set(quizData?.map((quiz) => quiz.difficulty)),
  ];

  // Filter Logic
  const filteredQuizzes = quizData?.filter((quiz) => {
    const isQuizAttempted = quizAttempts[quiz._id];
    const isQuizCorrect = isQuizAttempted && quizAttempts[quiz._id].isCorrect;

    const statusMatch =
      filters.status === "all" ||
      (filters.status === "answered" && isQuizAttempted) ||
      (filters.status === "unanswered" && !isQuizAttempted);

    const correctnessMatch =
      filters.correctness === "all" ||
      (filters.correctness === "correct" && isQuizCorrect) ||
      (filters.correctness === "incorrect" &&
        isQuizAttempted &&
        !isQuizCorrect);

    const difficultyMatch =
      filters.difficulty === "all" || filters.difficulty === quiz.difficulty;

    const subjectMatch =
      filters.subject === "all" || filters.subject === quiz.subject;

    return statusMatch && correctnessMatch && difficultyMatch && subjectMatch;
  });

  const handleOptionSelect = async (quiz, option) => {
    // Vibration effect
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }

    // Get current quiz attempts
    const currentAttempts = quizAttempts[quiz._id] || {
      selectedOptions: [],
      isCorrect: false,
    };

    // Check if the option is correct
    const isCorrectOption = option === quiz.correctAnswer;

    // Create a copy of selected options
    const updatedSelectedOptions = [...currentAttempts.selectedOptions];
    const optionIndex = updatedSelectedOptions.indexOf(option);

    // Toggle option selection
    if (optionIndex > -1) {
      updatedSelectedOptions.splice(optionIndex, 1);
    } else {
      updatedSelectedOptions.push(option);
    }

    // Determine if quiz is solved
    const isQuizSolved = isCorrectOption && updatedSelectedOptions.length === 1;

    // Update quiz attempts
    const newAttempts = {
      selectedOptions: updatedSelectedOptions,
      isCorrect: isQuizSolved,
    };

    // Update state
    setSelectedOptions((prev) => ({
      ...prev,
      [quiz._id]: updatedSelectedOptions,
    }));

    setQuizAttempts((prev) => ({
      ...prev,
      [quiz._id]: newAttempts,
    }));

    // Send request to backend if quiz is solved
    if (isQuizSolved) {
      try {
        await axios.post("/api/quiz-response", {
          quizId: quiz._id,
          selectedOption: option,
          isCorrect: true,
        });
      } catch (error) {
        console.error("Error sending quiz response:", error);
      }
    }
  };

  const getOptionBackgroundColor = (quiz, option) => {
    const quizAttempt = quizAttempts[quiz._id] || {
      selectedOptions: [],
      isCorrect: false,
    };
    const isOptionSelected = quizAttempt.selectedOptions.includes(option);
    const isCorrectOption = option === quiz.correctAnswer;

    // If quiz is solved and this is the correct option
    if (quizAttempt.isCorrect && isCorrectOption) {
      return "green";
    }

    // If option is selected
    if (isOptionSelected) {
      // If it's the correct option
      if (isCorrectOption) {
        return "green";
      }
      // If it's an incorrect option
      return "red";
    }

    return "transparent";
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    if (isSmallScreen) {
      setFilterDrawerOpen(false);
    }
  };

  // Render filters based on screen size
  const renderFilters = (inDrawer = false) => (
    <Stack
      direction={inDrawer ? "column" : "row"}
      spacing={inDrawer ? 3 : 2}
      sx={{
        width: inDrawer ? "100%" : "auto",
        p: inDrawer ? 2 : 0,
      }}
    >
      {/* Status Filter */}
      <FormControl
        size="small"
        sx={{ minWidth: 120, width: inDrawer ? "100%" : "auto" }}
      >
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status}
          label="Status"
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="answered">Answered</MenuItem>
          <MenuItem value="unanswered">Unanswered</MenuItem>
        </Select>
      </FormControl>

      {/* Correctness Filter */}
      <FormControl
        size="small"
        sx={{ minWidth: 120, width: inDrawer ? "100%" : "auto" }}
      >
        <InputLabel>Correctness</InputLabel>
        <Select
          value={filters.correctness}
          label="Correctness"
          onChange={(e) => handleFilterChange("correctness", e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="correct">Correct</MenuItem>
          <MenuItem value="incorrect">Incorrect</MenuItem>
        </Select>
      </FormControl>

      {/* Difficulty Filter */}
      <FormControl
        size="small"
        sx={{ minWidth: 120, width: inDrawer ? "100%" : "auto" }}
      >
        <InputLabel>Difficulty</InputLabel>
        <Select
          value={filters.difficulty}
          label="Difficulty"
          onChange={(e) => handleFilterChange("difficulty", e.target.value)}
        >
          {uniqueDifficulties.map((diff) => (
            <MenuItem key={diff} value={diff}>
              {diff === "all" ? "All Difficulties" : diff}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Subject Filter */}
      <FormControl
        size="small"
        sx={{ minWidth: 120, width: inDrawer ? "100%" : "auto" }}
      >
        <InputLabel>Subject</InputLabel>
        <Select
          value={filters.subject}
          label="Subject"
          onChange={(e) => handleFilterChange("subject", e.target.value)}
        >
          {uniqueSubjects.map((subject) => (
            <MenuItem key={subject} value={subject}>
              {subject === "all" ? "All Subjects" : subject}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );

  // Side drawer content
  const sideDrawerContent = (
    <Box sx={{ width: 280, pt: 1 }} role="presentation">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        <Typography variant="h6">Menu</Typography>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ my: 2 }} />
      <List>
        <ListItem>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem>
          <ListItemText primary="My Progress" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Favorites" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Box>
  );

  // Filter drawer content
  const filterDrawerContent = (
    <Box sx={{ width: 280, pt: 1 }} role="presentation">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={() => setFilterDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ my: 2 }} />
      {renderFilters(true)}
    </Box>
  );

  async function handleSaveForLater(id) {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/save4later/save4later`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: id,
          userId: localStorage.getItem("userId"),
        }),
      }
    );
    const resData = await response.json();
    const storedUserId = localStorage.getItem("userId");
    console.log(storedUserId);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {/* Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {sideDrawerContent}
      </Drawer>

      {/* Filter Drawer - Only for small screens */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        {filterDrawerContent}
      </Drawer>

      {/* Top App Bar */}
      <AppBar position="sticky" sx={{ mb: 0 }}>
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          {/* Menu Icon for small screens */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">Quiz Dashboard</Typography>
          </Box>

          {/* Filters for larger screens */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              justifyContent: "center",
            }}
          >
            {renderFilters()}
          </Box>

          {/* Filter Icon for small screens */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="filter"
            sx={{ display: { xs: "flex", sm: "none" } }}
            onClick={() => setFilterDrawerOpen(true)}
          >
            <FilterListIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Quiz Content */}
      <Container
        maxWidth="md"
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: filteredQuizzes?.length ? "flex-start" : "center",
          alignItems: "center",
          pt: filteredQuizzes?.length ? 3 : 0,
        }}
      >
        {filteredQuizzes?.length ? (
          filteredQuizzes.map((quiz) => (
            <Box
              key={quiz._id}
              sx={{
                width: "100%",
                my: 2,
                p: 3,
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              {/* Difficulty Chip */}
              <Typography
                variant="overline"
                color="textSecondary"
                sx={{
                  mb: 2,
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                }}
              >
                {quiz.difficulty} Difficulty
              </Typography>

              {/* Question */}
              <Typography variant="h5" gutterBottom>
                {quiz.question}
              </Typography>

              {/* Subject */}
              <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ mb: 2 }}
              >
                Subject: {quiz.subject}
              </Typography>

              {/* Options */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {quiz.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={() => handleOptionSelect(quiz, option)}
                    sx={{
                      backgroundColor: getOptionBackgroundColor(quiz, option),
                      color: (
                        quizAttempts[quiz._id]?.selectedOptions || []
                      ).includes(option)
                        ? "white"
                        : "inherit",
                      "&:hover": {
                        backgroundColor: getOptionBackgroundColor(quiz, option),
                      },
                      justifyContent: "flex-start",
                      textAlign: "left",
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>

              {/* Feedback (Only for solved quizzes) */}
              {quizAttempts[quiz._id]?.isCorrect && (
                <Typography variant="body2" color="green" sx={{ mt: 2 }}>
                  Correct! Great job!
                </Typography>
              )}

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  mt: 3,
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  {/* Like Button */}
                  <Tooltip title="Like">
                    <IconButton
                      onClick={() => handleLike(quiz._id)}
                      color={quiz.liked ? "primary" : "default"}
                      size="small"
                    >
                      <ThumbUpIcon />
                    </IconButton>
                  </Tooltip>

                  {/* Dislike Button */}
                  <Tooltip title="Dislike">
                    <IconButton
                      onClick={() => handleDislike(quiz._id)}
                      color={quiz.disliked ? "primary" : "default"}
                      size="small"
                    >
                      <ThumbDownIcon />
                    </IconButton>
                  </Tooltip>

                  {/* Report Wrong Button */}
                  <Tooltip title="Report as Wrong">
                    <IconButton
                      onClick={() => handleReportWrong(quiz._id)}
                      color={quiz.reported ? "error" : "default"}
                      size="small"
                    >
                      <ReportProblemIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  {/* Save for Later Button */}
                  <Tooltip title="Save for Later">
                    <IconButton
                      onClick={() => handleSaveForLater(quiz._id)}
                      color={quiz.saved ? "primary" : "default"}
                      size="small"
                    >
                      <BookmarkIcon />
                    </IconButton>
                  </Tooltip>

                  {/* Edit Button */}
                  <Tooltip title="Edit Quiz">
                    <IconButton
                      component={Link}
                      to={`/${quiz._id}`}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{
              textAlign: "center",
              maxWidth: 400,
              px: 2,
            }}
          >
            loading...
          </Typography>
        )}
      </Container>
    </ThemeProvider>
  );
}
