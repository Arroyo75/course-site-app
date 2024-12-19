import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text, Heading, VStack, Image, Spinner, HStack, Button } from '@chakra-ui/react';
import { useCourseStore } from '../../store/courseStore.jsx';
import { useAuthStore } from '../../store/authStore.jsx';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { courses, fetchCourses } = useCourseStore();
  const { user } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (courses.length === 0) {
        await fetchCourses();
      }

      const foundCourse = courses.find((course) => course._id === id);

      if (foundCourse) {
        setCourse(foundCourse);
      }

      setLoading(false);
    };

    fetchData();
  }, [id, courses, fetchCourses]);

  if (loading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" color="orange.400" />
      </Box>
    );
  }

  if (!course) {
    return (
      <Box textAlign="center" py={20}>
        <Text fontSize="xl" fontWeight="bold" color="gray.500">
          Course not found.
        </Text>
      </Box>
    );
  }

  const isAuthor = course.author?._id === user?.id;
  console.log(isAuthor);

  const handleDelete = () => {

  }

  const handleEdit = () => {

  }

  return (
    <Box maxW="container.md" mx="auto" py={12} px={6} bg="gray.900" color="white" rounded="lg" shadow="lg">
      <VStack spacing={6}>
        <Image src={course.image} alt={course.title} w="full" h={64} objectFit="cover" rounded="lg" />
        <Heading>{course.title}</Heading>
        <Text fontSize="lg">{course.description}</Text>
        <Text fontSize="md" color="gray.400">
          by {course.author?.name || "Unknown"}
        </Text>
        {isAuthor ? (
          <HStack spacing={4}>
          <Button
            onClick={handleEdit}
            colorScheme={"orange"}
            width={"25vw"}
          >
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            colorScheme={"orange"}
            width={"25vw"}
          >
            Delete
          </Button>
        </HStack>
        ) : (
          <Button>
            Enroll
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default CourseDetailPage;
