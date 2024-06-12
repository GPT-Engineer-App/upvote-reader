import React, { useEffect, useState } from "react";
import { Container, Text, VStack, Box, Link, Switch, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { FaArrowUp } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
      .then((response) => response.json())
      .then((data) => {
        const top10Ids = data.slice(0, 10);
        return Promise.all(
          top10Ids.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((response) => response.json())
          )
        );
      })
      .then((stories) => setStories(stories));
  }, []);

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(filter.toLowerCase()) &&
      (filter === "" || story.title.toLowerCase().includes("security") || story.title.toLowerCase().includes("ai"))
  );

  return (
    <Container
      centerContent
      maxW="container.md"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg={darkMode ? "gray.800" : "gray.100"}
      color={darkMode ? "white" : "black"}
    >
      <VStack spacing={4} width="100%">
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="dark-mode" mb="0">
            Dark Mode
          </FormLabel>
          <Switch id="dark-mode" isChecked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="filter">Filter by keyword (security, AI)</FormLabel>
          <Input id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} />
        </FormControl>
        {filteredStories.map((story) => (
          <Box
            key={story.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            width="100%"
            bg={darkMode ? "gray.700" : "white"}
          >
            <Text fontSize="xl" fontWeight="bold">
              {story.title}
            </Text>
            <Link href={story.url} color="teal.500" isExternal>
              Read more
            </Link>
            <Text mt={2}>
              <FaArrowUp /> {story.score} upvotes
            </Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;