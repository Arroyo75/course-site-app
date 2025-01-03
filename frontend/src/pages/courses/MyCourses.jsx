import { useEffect, useState } from 'react';
import { Box, Spinner, Text, VStack, SimpleGrid, Heading } from '@chakra-ui/react';
import { useCourseStore } from '../../store/courseStore.jsx';
import CourseCard from '../../components/CourseCard.jsx';

const MyCourses = () => {

  const { userCourses, fetchUserCourses } = useCourseStore();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchUserCourses();
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
    };
    fetchData();
  }, [fetchUserCourses]);

  if (loading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" color="orange.400" />
      </Box>
    );
  }

  if(error) {
    return (
      <Box textAlign="center" py={20}>
        <Text color="red.500">{error}</Text>
      </Box>
    )
  }

  return (
    <VStack spacing={8} w="full" align="stretch" p={4}>
        <Box>
            <Heading size="lg" mb={4}>Courses I Created</Heading>
            {userCourses.created.length === 0 ? (
                <Text color="gray.500">You havent created any courses yet.</Text>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {userCourses.created.map(course => (
                        <CourseCard key={course._id} course={course} />
                    ))}
                </SimpleGrid>
            )}
        </Box>

        <Box>
            <Heading size="lg" mb={4}>Enrolled Courses</Heading>
            {userCourses.enrolled.length === 0 ? (
                <Text color="gray.500">You havent enrolled in any courses yet.</Text>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {userCourses.enrolled.map(course => (
                        <CourseCard key={course._id} course={course} />
                    ))}
                </SimpleGrid>
            )}
        </Box>
    </VStack>
);
}

export default MyCourses