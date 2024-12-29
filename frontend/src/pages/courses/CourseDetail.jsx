import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Text, Heading, VStack, Flex, Image, Spinner, HStack, Button, useToast } from '@chakra-ui/react';
import { useCourseStore } from '../../store/courseStore.jsx';
import { useAuthStore } from '../../store/authStore.jsx';
import LectureList from '../../components/LectureList.jsx';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { courses, fetchCourses, deleteCourse } = useCourseStore();
  const { user } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const toast = useToast();
  const navigate = useNavigate();

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

  const handleDelete = async (cid) => {
    const { success, message } = await deleteCourse(cid);
    if(!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } else {
      toast({
        title: 'Course Deleted',
        description: message,
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    }
    navigate("/");
  }

  const handleEdit = () => {

  }

  return (
    <Box maxW="container.xl" mx="auto">
      <Flex align={"flex-start"} flexDir={{ base: 'column', md: 'row'}}>
        <Box width={{base: "100%", md: "50%"}} py={12} px={6} bg="gray.900" color="white" rounded="lg" shadow="lg">
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
                width={"20vw"}
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(course._id)}
                colorScheme={"orange"}
                width={"20vw"}
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
        <Box width={{base: "100%", md: "50%"}} py={12} px={6} bg="gray.900" color="white" rounded="lg" shadow="lg" display="flex" flexDirection="column" alignItems="center">
          <LectureList course={course} />
        </Box>
      </Flex>
    </Box>
  );
};

export default CourseDetailPage;
