import { Box, VStack, Text, SimpleGrid, Container } from '@chakra-ui/react';
import { useCourseStore } from '../../store/courseStore.jsx';
import CourseCard from '../../components/CourseCard.jsx';

const SearchPage = () => {
  const { searchResults, searchQuery } = useCourseStore();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" color="white">
          {searchQuery
            ? `Search results for: "${searchQuery}"`
            : "Search for courses"}
        </Text>
        {searchQuery && searchResults.length === 0 ? (
          <Box bg="gray.800" p={6} borderRadius="md">
            <Text color="gray.400">
              No courses found matching your search.
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {searchResults.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  )
}

export default SearchPage;