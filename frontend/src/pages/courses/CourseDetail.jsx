import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Text, Heading, VStack, Flex, Image, Spinner, HStack, Button, useToast } from '@chakra-ui/react';
import { useCourseStore } from '../../store/courseStore.jsx';
import { useAuthStore } from '../../store/authStore.jsx';
import LectureList from '../../components/LectureList.jsx';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { courses, fetchCourses, deleteCourse, enrollInCourse } = useCourseStore();
  const { user } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

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
        if(user) {
          setIsEnrolled(foundCourse.students?.includes(user.id));
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [id, courses, fetchCourses, user]);

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

  const handleEnroll = async (cid) => {
    if(!user) {
      navigate("/login");
      return;
    }

    const { success, message } = await enrollInCourse(cid);

    if(!success) {
      toast({
        title: 'Error',
        description: message,
        staus: 'error',
        duration: 3000,
        isCloseable: true
      });
    } else {
      setIsEnrolled(true);
      toast({
        title: 'Success',
        description: message,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    }
  }

  const sharedButtonStyle = {
    width: "20vw",
    height: "50px",
    borderRadius: "md",
    textAlign: "center",
    lineHeight: "50px",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  return (
    <Box maxW="container.xl" mx="auto" mt={{ base: 6, sm: 7, md: 0}}>
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
                bg="gray.900"
                color="blue.700"
                _hover={{ bg: 'gray.800' }}
                _active={{ bg: '#2d5382', color: 'gray.900' }}
                border="1px solid #2d5382"
                {...sharedButtonStyle}
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(course._id)}
                bg="gray.900"
                color="red.700"
                _hover={{ bg: 'gray.800' }}
                _active={{ bg: '#9a2c2d', color: 'gray.900' }}
                border="1px solid #9a2c2d"
                {...sharedButtonStyle}
              >
                Delete
              </Button>
            </HStack>
            ) : ( !isEnrolled ? (
              <Button
                onClick={() => handleEnroll(course._id)}
                bg="gray.900"
                color="green.500"
                _hover={{ bg: 'gray.800' }}
                _active={{ bg: '#37a169', color: 'gray.900' }}
                border="1px solid #37a169"
                {...sharedButtonStyle}
              >
                Enroll
              </Button>
            ) : (
              <Box 
                p={4} 
                bg="gray.900" 
                color="orange.500"
                border="1px solid #dd6b20"
                {...sharedButtonStyle}
              >
                Enrolled
              </Box>
            ))}
          </VStack>
        </Box>
        <Box width={{base: "100%", md: "50%"}} py={12} px={6} bg="gray.900" color="white" rounded="lg" shadow="lg" display="flex" flexDirection="column" alignItems="center">
          <LectureList course={course} isEnrolled={isEnrolled}/>
        </Box>
      </Flex>
    </Box>
  );
};

export default CourseDetailPage;
